import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTINUOUS_LIMIT,CONTINUOUS_TEMPLATES,createContinuousState,createNetworkState,
  networkCommand as command,stepNetwork as step,networkRoutePlan,routeOptions,
  checkNetworkRoute,validateNetworkState,isValidNetworkSave,activeNetworkEvents} from '../app/network.mjs';

function running(seed=42){const state=createContinuousState({seed,assistance:'independent'});command(state,'pause');return state;}
function handleProtection(state){
  for(const e of state.events.filter(e=>e.important&&!e.acknowledged))assert.equal(command(state,'ack',{eventId:e.id}).ok,true);
  if(state.work.active&&state.work.ready)assert.equal(command(state,'releaseWork').ok,true);
}
function dispatch(state,onlyId=null){
  const priority=t=>t.status==='platform'?(t.leg===t.itinerary.length-1?0:1):2;
  for(const t of [...state.trains].sort((a,b)=>priority(a)-priority(b)||a.due-b.due)){
    if(onlyId&&t.id!==onlyId||!['waiting','platform'].includes(t.status))continue;
    let accepted=false;
    for(const option of routeOptions(state,t.id)){
      for(let variant=0;variant<option.paths.length;variant++){
        const plan=networkRoutePlan(state,t.id,option.destinationId,variant);
        if(!checkNetworkRoute(state,plan,{ignorePoints:true}).ok)continue;
        const request=command(state,'preview',{trainId:t.id,destinationId:option.destinationId,variant});
        assert.equal(request.ok,true);assert.equal(command(state,'align').ok,true);
        assert.equal(command(state,'confirm',{previewId:request.previewId}).ok,true);accepted=true;break;
      }if(accepted)break;
    }
  }
}
function tick(state,onlyId=null){handleProtection(state);dispatch(state,onlyId);step(state);assert.deepEqual(validateNetworkState(state),[],`Invalid continuous state at ${state.time}`);}

test('dismissal persists per report without acknowledgement, protection release or hiding a later report',()=>{
  const state=createNetworkState({assistance:'independent'});command(state,'pause');step(state);
  const first=state.events.find(e=>e.kind==='work-start'),before=structuredClone({work:state.work,points:state.points,time:state.time});
  assert.equal(command(state,'dismiss',{eventId:first.id}).ok,true);
  assert.equal(first.dismissed,true);assert.equal(first.acknowledged,false);assert.equal(first.resolved,false);
  assert.deepEqual({work:state.work,points:state.points,time:state.time},before);
  assert.ok(activeNetworkEvents(state).some(e=>e.id===first.id));
  const saved=JSON.parse(JSON.stringify(state));assert.equal(isValidNetworkSave(saved),true);assert.equal(saved.events[0].dismissed,true);
  const legacy=structuredClone(state);delete legacy.events[0].dismissed;assert.equal(isValidNetworkSave(legacy),true,'Existing fixed saves did not contain banner state');
  assert.equal(command(state,'restoreNotice',{eventId:first.id}).ok,true);assert.equal(first.dismissed,false);
  command(state,'dismiss',{eventId:first.id});assert.equal(command(state,'releaseWork').ok,false);
  step(state,89);const later=state.events.find(e=>e.kind==='work-clear');
  assert.notEqual(later.id,first.id);assert.equal(later.dismissed,false);assert.equal(later.acknowledged,false);assert.equal(state.work.active,true);
  command(state,'dismiss',{eventId:later.id});command(state,'ack',{eventId:later.id});assert.equal(state.work.active,true);
  assert.equal(command(state,'releaseWork').ok,true);assert.equal(later.resolved,true);
});

test('continuous admission is seeded and bounded while delayed services wait safely outside the railway',()=>{
  const state=running();step(state,1200);
  assert.equal(state.trains.length,CONTINUOUS_LIMIT);assert.ok(state.trains.every(t=>t.status==='waiting'));
  assert.deepEqual(state.occupancy,{});assert.equal(state.continuous.summary.completed,0);
  const roster=structuredClone(state.trains),rng=state.continuous.rng,nextId=state.continuous.nextId;
  step(state,500);assert.deepEqual(state.trains,roster);assert.equal(state.continuous.rng,rng);assert.equal(state.continuous.nextId,nextId);
  for(const t of state.trains){const template=CONTINUOUS_TEMPLATES.find(p=>p.templateId===t.templateId);assert.equal(t.arrival,t.admittedAt+5);assert.equal(t.due,t.arrival+template.budget);}
  assert.deepEqual(validateNetworkState(state),[]);
});

test('several continuous roster cycles stay safe and bounded while freight sidings empty and are reused',context=>{
  const state=running(),seenTemplates=new Set(),sidingVisits=new Map(),freed=new Set();let previous={},checkedLock=false;
  for(let i=0;i<3200;i++){
    for(const t of state.trains)seenTemplates.add(t.templateId);
    const before=structuredClone(state.continuous.summary);tick(state);
    const after=state.continuous.summary,finished=after.completed-before.completed;
    assert.ok(after.points-before.points>=finished*25&&after.points-before.points<=finished*100);
    assert.equal(state.complete,false);assert.equal(state.paused,false);assert.ok(state.trains.length<=CONTINUOUS_LIMIT);
    assert.ok(state.events.length<=CONTINUOUS_LIMIT*2+24);assert.ok(state.journal.length<=150);
    const reserved=state.routes.flatMap(r=>r.resources);assert.equal(new Set(reserved).size,reserved.length,'Generated traffic cannot bypass exclusive resources');
    if(!checkedLock&&state.routes.length){
      const p=state.routes[0].points[0],before=structuredClone(state.points[p.id]),score=state.continuous.summary.points;
      assert.equal(command(state,'point',{pointId:p.id,position:p.position==='normal'?'reverse':'normal'}).ok,false);
      assert.deepEqual(state.points[p.id],before);assert.equal(state.continuous.summary.points,score);checkedLock=true;
    }
    for(const id of ['berth:depot:siding-1','berth:depot:siding-2']){
      const occupant=state.occupancy[id];if(previous[id]&&!occupant)freed.add(id);
      if(occupant){if(!sidingVisits.has(id))sidingVisits.set(id,new Set());sidingVisits.get(id).add(occupant);}
      previous[id]=occupant;
    }
  }
  assert.ok(state.continuous.summary.completed>=28,'The stream must continue beyond several seven-template cycles');
  assert.deepEqual([...seenTemplates].sort(),CONTINUOUS_TEMPLATES.map(t=>t.templateId).sort());
  for(const id of ['berth:depot:siding-1','berth:depot:siding-2']){assert.ok(freed.has(id),`${id} must physically clear`);assert.ok(sidingVisits.get(id)?.size>=2,`${id} must receive later freights`);}
  assert.equal(state.continuous.summary.onTime+state.continuous.summary.late,state.continuous.summary.completed);
  assert.equal(checkedLock,true);
  context.diagnostic(`At ${state.time}s: ${state.continuous.summary.completed} completed, ${state.continuous.summary.points} points; siding visits ${[...sidingVisits.values()].map(ids=>ids.size).join('/')}; ${state.events.length} retained events.`);
});

test('seeded continuous traffic resumes deterministically without offline time or duplicate awards',()=>{
  const original=running(99);for(let i=0;i<450;i++)tick(original);
  command(original,'pause');const saved=JSON.parse(JSON.stringify(original)),frozen=structuredClone(saved);
  assert.equal(isValidNetworkSave(saved),true);step(saved,10000);assert.deepEqual(saved,frozen);
  command(original,'pause');command(saved,'pause');
  for(let i=0;i<650;i++){tick(original);tick(saved);}
  assert.deepEqual(saved,original);
  const corrupt=structuredClone(saved);corrupt.continuous.summary.points+=100000;assert.equal(isValidNetworkSave(corrupt),false);
  const wrongTemplate=structuredClone(saved);wrongTemplate.trains[0].templateId='missing';assert.equal(isValidNetworkSave(wrongTemplate),false);
});

test('a delayed completion earns its declared contribution once, not for point or route clicks',()=>{
  const state=running(7),first=state.trains[0],id=first.id;step(state,first.due+150);handleProtection(state);
  const noScore=structuredClone(state.continuous.summary);for(let i=0;i<3;i++)command(state,'point',{pointId:'missing',position:'normal'});
  assert.deepEqual(state.continuous.summary,noScore);
  for(let i=0;i<1000&&state.trains.some(t=>t.id===id);i++)tick(state,id);
  assert.ok(!state.trains.some(t=>t.id===id));const summary=structuredClone(state.continuous.summary),delay=summary.last.time-first.due;
  assert.equal(summary.completed,1);assert.equal(summary.late,1);assert.equal(summary.totalDelay,delay);
  assert.equal(summary.points,Math.max(25,100-Math.floor(delay*(first.kind==='Freight'?1:2)/15)));
  step(state,200);assert.deepEqual(state.continuous.summary,summary,'A retired service cannot contribute twice');
});
