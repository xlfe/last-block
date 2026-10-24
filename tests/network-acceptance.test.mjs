import test from 'node:test';
import assert from 'node:assert/strict';
import {NETWORK,createNetworkState,networkCommand as command,stepNetwork as step,
  networkRoutePlan,validateNetworkState,isValidNetworkSave,pointId,trackId} from '../app/network.mjs';

function running() {
  const state=createNetworkState({assistance:'independent'});
  command(state,'pause');
  return state;
}
function preview(state,trainId,track) {
  const plan=networkRoutePlan(state,trainId,track);
  assert.equal(plan.error,undefined);
  for(const point of plan.points)assert.equal(command(state,'point',{districtId:point.district,side:point.side,track:point.track}).ok,true);
  const result=command(state,'preview',{trainId,track});
  assert.equal(result.ok,true);
  return result.previewId;
}
function request(state,trainId,track) {
  return command(state,'confirm',{previewId:preview(state,trainId,track)});
}
function pair({release=true}={}) {
  const state=running();
  step(state,12);
  assert.equal(request(state,'301',1).ok,true);
  assert.equal(request(state,'402',1).ok,true);
  step(state,30);
  if(release) {
    const completion=state.events.find(e=>e.kind==='work-clear');
    command(state,'ack',{eventId:completion.id});
    assert.equal(command(state,'releaseWork').ok,true);
  }
  assert.deepEqual(validateNetworkState(state),[]);
  return state;
}
const railway=state=>({time:state.time,paused:state.paused,trains:state.trains,routes:state.routes,
  reservations:state.reservations,occupancy:state.occupancy,points:state.points,work:state.work,events:state.events});

test('one shared link excludes opposing transfers through proving and tail clearance',()=>{
  const state=pair();
  assert.equal(request(state,'301',2).ok,true);
  const route=state.routes[0];
  assert.equal(state.reservations[NETWORK.link],route.id);
  assert.equal(route.state,'proving');
  assert.equal(state.occupancy[NETWORK.link],undefined);
  step(state);
  assert.equal(route.state,'proving');
  step(state);
  assert.equal(route.state,'locked');
  assert.equal(command(state,'point',{districtId:'higashi',side:'west',track:1}).ok,false);
  command(state,'preview',{trainId:'402',track:2});
  const before=structuredClone(state.reservations);
  assert.equal(command(state,'confirm',{previewId:state.preview.id}).ok,false);
  assert.deepEqual(state.reservations,before);
  step(state,23);
  assert.equal(state.reservations[NETWORK.link],route.id);
  assert.equal(command(state,'confirm',{previewId:state.preview.id}).ok,false);
  step(state);
  assert.equal(state.reservations[NETWORK.link],undefined);
  assert.equal(state.trains.find(t=>t.id==='301').district,'higashi');
  assert.equal(state.trains.find(t=>t.id==='301').stops,2);
  assert.equal(state.occupancy[trackId('higashi',2)],'301');
  assert.equal(state.occupancy[trackId('mizuno',1)],undefined);
  assert.equal(request(state,'402',1).ok,true);
  assert.deepEqual(validateNetworkState(state),[]);
});

test('receiving berth occupancy and work protection block transfer without partial reservations',()=>{
  const state=pair({release:false});
  const occupied=preview(state,'301',1);
  assert.equal(command(state,'confirm',{previewId:occupied}).ok,false);
  assert.deepEqual(state.reservations,{});
  const protectedTrack=preview(state,'301',2);
  assert.equal(command(state,'confirm',{previewId:protectedTrack}).ok,false);
  assert.deepEqual(state.reservations,{});
  assert.ok(Object.values(state.points).every(p=>p.owner===null));
});

test('the authored exchange-berth rule holds an arrival safely at the boundary',()=>{
  const state=pair();
  step(state,22);
  const id=preview(state,'303',2);
  const result=command(state,'confirm',{previewId:id});
  assert.equal(result.ok,false);
  assert.match(result.message,/402/);
  assert.equal(state.trains.find(t=>t.id==='303').status,'waiting');
  assert.deepEqual(state.reservations,{});
  // The opposing transfer remains possible; the guard does not freeze the line.
  assert.equal(request(state,'402',2).ok,true);
});

test('preview is read-only and confirmation rechecks changed detection',()=>{
  const state=pair();
  const id=preview(state,'301',2);
  assert.deepEqual(state.reservations,{});
  assert.equal(state.routes.length,0);
  assert.ok(Object.values(state.points).every(p=>p.owner===null));
  // Inject a detector failure between preview and confirmation.
  state.detection[NETWORK.link]='unknown';
  assert.equal(command(state,'confirm',{previewId:id}).ok,false);
  assert.deepEqual(state.reservations,{});
  assert.equal(state.routes.length,0);
  state.detection[NETWORK.link]='clear';
  assert.equal(command(state,'confirm',{previewId:id}).ok,true);
});

test('district navigation clears an armed preview, retains the train and never changes the clock',()=>{
  const state=pair();
  command(state,'select',{trainId:'301'});
  const id=preview(state,'301',2),before=structuredClone(railway(state));
  assert.equal(command(state,'view',{districtId:'higashi'}).ok,true);
  assert.equal(state.selected,'301');
  assert.equal(state.preview,null);
  assert.deepEqual(railway(state),before);
  assert.equal(command(state,'confirm',{previewId:id}).ok,false);
  assert.deepEqual(state.reservations,{});
  assert.equal(state.paused,false);
});

test('unseen districts advance under the same global clock and retain route locks',()=>{
  const state=pair();
  assert.equal(request(state,'301',2).ok,true);
  const other=structuredClone(state);
  command(other,'view',{districtId:'higashi'});
  step(state,10);
  step(other,10);
  assert.deepEqual(railway(state),railway(other));
  assert.equal(other.occupancy[NETWORK.link],'301');
  assert.ok(other.points[pointId('mizuno','east')].owner);
  assert.ok(other.points[pointId('higashi','west')].owner);
});

test('acknowledged offscreen protection persists, and Guided pauses once per important event',()=>{
  const state=createNetworkState();
  command(state,'pause');
  step(state,20);
  assert.equal(state.time,1);
  assert.equal(state.paused,true);
  const initial=state.events.find(e=>e.kind==='work-start');
  assert.equal(initial.location,'higashi');
  command(state,'ack',{eventId:initial.id});
  assert.equal(initial.resolved,false);
  command(state,'view',{districtId:'higashi'});
  command(state,'view',{districtId:'mizuno'});
  assert.equal(initial.resolved,false);
  assert.equal(command(state,'releaseWork').ok,false);
  command(state,'pause');
  step(state,10);
  assert.equal(state.time,11);
  assert.equal(state.paused,false);
  assert.equal(state.events.filter(e=>e.kind==='work-start').length,1);
  step(state,100);
  assert.equal(state.time,42);
  assert.equal(state.paused,true);
  const completion=state.events.find(e=>e.kind==='work-clear');
  assert.equal(command(state,'releaseWork').ok,false);
  command(state,'ack',{eventId:completion.id});
  assert.equal(state.work.active,true);
  assert.equal(completion.resolved,false);
  assert.equal(command(state,'releaseWork').ok,true);
  assert.equal(state.work.active,false);
  assert.ok(state.events.filter(e=>e.condition==='work-higashi-2').every(e=>e.resolved));
});

test('live multi-district snapshots retain locks and reject incompatible content or orphan ownership',()=>{
  const state=pair();
  request(state,'301',2);
  step(state,10);
  const restored=JSON.parse(JSON.stringify(state));
  assert.equal(isValidNetworkSave(restored),true);
  assert.deepEqual(railway(restored),railway(state));
  restored.paused=true;
  const frozen=structuredClone(railway(restored));
  step(restored,500);
  assert.deepEqual(railway(restored),frozen);
  const incompatible=structuredClone(state);
  incompatible.contentRevision++;
  assert.equal(isValidNetworkSave(incompatible),false);
  const lost=structuredClone(state);
  delete lost.reservations[NETWORK.link];
  assert.equal(isValidNetworkSave(lost),false);
  for(const [field,value] of [['points',{}],['detection',{}],['selected','missing-train']]) {
    const corrupt=createNetworkState();
    corrupt[field]=value;
    assert.equal(isValidNetworkSave(corrupt),false,`Invalid ${field} must not reach the renderer`);
  }
  assert.equal(isValidNetworkSave({version:1}),false);
});

test('all six trains can make a complete connected journey using legal commands',()=>{
  const state=running();
  for(let tick=0;tick<1000&&!state.complete;tick++) {
    for(const event of state.events.filter(e=>e.important&&!e.acknowledged))command(state,'ack',{eventId:event.id});
    if(state.work.active&&state.work.ready)command(state,'releaseWork');
    // Prioritise exits and transfers, leaving the outer boundary as a safe queue.
    const priority=t=>t.status==='platform'?(t.stops===2?0:1):2;
    for(const train of [...state.trains].sort((a,b)=>priority(a)-priority(b))) {
      if(!['waiting','platform'].includes(train.status)||train.status==='platform'&&train.boarding<train.dwell)continue;
      for(const track of [1,2]) {
        const plan=networkRoutePlan(state,train.id,track);
        if(plan.error||plan.resources.some(id=>state.reservations[id]||state.occupancy[id]&&state.occupancy[id]!==train.id||state.detection[id]!=='clear')||state.work.active&&plan.resources.includes(trackId('higashi',2))||plan.points.some(p=>state.points[pointId(p.district,p.side)].owner))continue;
        const result=request(state,train.id,track);
        if(result.ok)break;
      }
    }
    step(state);
    assert.deepEqual(validateNetworkState(state),[],`network tick ${state.time}`);
  }
  assert.equal(state.complete,true);
  assert.equal(state.work.released,true);
  assert.equal(state.trains.every(t=>t.status==='done'&&t.stops===2),true);
  assert.equal(state.results.total,6);
  assert.deepEqual(state.reservations,{});
  assert.deepEqual(state.occupancy,{});
  assert.ok(state.events.every(event=>event.resolved),'Obsolete routine events must not remain in the attention rail');
});
