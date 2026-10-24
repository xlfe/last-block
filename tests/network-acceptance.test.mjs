import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAPH,SERVICES,createNetworkState,networkCommand as command,stepNetwork as step,
  networkRoutePlan,routeOptions,checkNetworkRoute,validateNetworkState,isValidNetworkSave} from '../app/network.mjs';
import {targetNodes} from '../app/network-paths.mjs';

function running(){const state=createNetworkState({assistance:'independent'});command(state,'pause');return state;}
function preview(state,trainId,destinationId,variant=0){const result=command(state,'preview',{trainId,destinationId,variant});assert.equal(result.ok,true,result.message);return result.previewId;}
function request(state,trainId,destinationId,variant=0){const id=preview(state,trainId,destinationId,variant);const aligned=command(state,'align');assert.equal(aligned.ok,true,aligned.message);return command(state,'confirm',{previewId:id});}
function board(state,id){const t=state.trains.find(t=>t.id===id);if(t.status==='platform'&&t.boarding<t.dwell)step(state,t.dwell-t.boarding);}
function travel(state,id,destinationId){
  const t=state.trains.find(t=>t.id===id);
  if(t.status==='scheduled')step(state,Math.max(1,t.arrival-state.time));
  board(state,id);destinationId??=targetNodes(t.itinerary[t.leg])[0];
  const result=request(state,id,destinationId);assert.equal(result.ok,true,result.message);
  const route=state.routes.find(r=>r.trainId===id);step(state,route.duration);
  assert.equal(t.nodeId,destinationId);assert.deepEqual(validateNetworkState(state),[]);
}
function opposingPair(){const state=running();travel(state,'301','mizuno:track-1');travel(state,'402','higashi:track-1');travel(state,'402','kawara:track-1');board(state,'402');return state;}
const railway=s=>({time:s.time,paused:s.paused,trains:s.trains,routes:s.routes,reservations:s.reservations,occupancy:s.occupancy,points:s.points,work:s.work,events:s.events});

test('opposing graph paths share canonical resources through proof and tail clearance',()=>{
  const state=opposingPair(),first=networkRoutePlan(state,'301','kawara:track-2'),opposing=networkRoutePlan(state,'402','mizuno:track-2');
  const shared=first.resources.filter(id=>opposing.resources.includes(id));
  assert.ok(shared.some(id=>!id.startsWith('point:')&&!id.startsWith('berth:')),'The conflict must include a real interstation section');
  assert.equal(request(state,'301','kawara:track-2').ok,true);
  const route=state.routes[0];assert.equal(route.state,'proving');
  assert.ok(shared.every(id=>state.reservations[id]===route.id));
  step(state);assert.equal(route.state,'proving');step(state);assert.equal(route.state,'locked');
  const point=route.points[0],before=structuredClone(state.points[point.id]);
  assert.equal(command(state,'point',{pointId:point.id,position:point.position==='normal'?'reverse':'normal'}).ok,false);
  assert.deepEqual(state.points[point.id],before);
  const id=preview(state,'402','mizuno:track-2'),reserved=structuredClone(state.reservations),points=structuredClone(state.points);
  assert.equal(command(state,'align').ok,false);assert.deepEqual(state.points,points);
  assert.equal(command(state,'confirm',{previewId:id}).ok,false);assert.deepEqual(state.reservations,reserved);
  step(state,route.duration-3);
  assert.ok(shared.every(id=>state.reservations[id]===route.id));
  assert.equal(command(state,'confirm',{previewId:id}).ok,false);
  step(state);assert.equal(state.routes.length,0);assert.equal(state.trains.find(t=>t.id==='301').nodeId,'kawara:track-2');
  assert.equal(request(state,'402','mizuno:track-2').ok,true);assert.deepEqual(validateNetworkState(state),[]);
});

test('occupied receiving berths and protected terminal sidings refuse the whole transaction',()=>{
  const occupied=opposingPair(),id=preview(occupied,'301','kawara:track-1');
  assert.equal(command(occupied,'align').ok,false);assert.equal(command(occupied,'confirm',{previewId:id}).ok,false);
  assert.deepEqual(occupied.reservations,{});assert.ok(Object.values(occupied.points).every(p=>p.owner===null));
  const protectedState=running();travel(protectedState,'F82','higashi:track-1');travel(protectedState,'F82','depot:track-1');board(protectedState,'F82');
  const terminal=preview(protectedState,'F82','depot:siding-2');
  assert.equal(command(protectedState,'align').ok,false);assert.equal(command(protectedState,'confirm',{previewId:terminal}).ok,false);
  assert.deepEqual(protectedState.reservations,{});
});

test('a full station holds another service safely at the boundary until a berth clears',()=>{
  const state=running();travel(state,'301','mizuno:track-1');travel(state,'311','mizuno:track-2');step(state,Math.max(0,170-state.time));
  for(const destination of ['mizuno:track-1','mizuno:track-2']){
    const id=preview(state,'F71',destination);assert.equal(command(state,'align').ok,false);assert.equal(command(state,'confirm',{previewId:id}).ok,false);
  }
  assert.equal(state.trains.find(t=>t.id==='F71').status,'waiting');assert.deepEqual(state.reservations,{});
  travel(state,'301','kawara:track-1');assert.equal(request(state,'F71','mizuno:track-1').ok,true);
});

test('preview and point alignment grant no authority; confirmation rechecks detection',()=>{
  const state=opposingPair(),id=preview(state,'301','kawara:track-2');
  assert.deepEqual(state.reservations,{});assert.equal(state.routes.length,0);
  assert.equal(command(state,'align').ok,true);assert.deepEqual(state.reservations,{});assert.ok(Object.values(state.points).every(p=>p.owner===null));
  const resource=state.preview.resources.find(id=>id==='west-upper-main'||id==='west-lower-main');assert.ok(resource);
  state.detection[resource]='unknown';assert.equal(command(state,'confirm',{previewId:id}).ok,false);assert.deepEqual(state.reservations,{});
  state.detection[resource]='clear';assert.equal(command(state,'confirm',{previewId:id}).ok,true);
});

test('view changes clear a stale preview but preserve selected service, clock and railway resources',()=>{
  const state=opposingPair();command(state,'select',{trainId:'301'});const id=preview(state,'301','kawara:track-2'),before=structuredClone(railway(state));
  assert.equal(command(state,'view',{districtId:'north'}).ok,true);assert.equal(state.selected,'301');assert.equal(state.preview,null);assert.deepEqual(railway(state),before);
  assert.equal(command(state,'confirm',{previewId:id}).ok,false);assert.deepEqual(state.reservations,{});assert.equal(state.paused,false);
  request(state,'301','kawara:track-2');const other=structuredClone(state);command(other,'view',{districtId:'relief'});step(state,5);step(other,5);assert.deepEqual(railway(state),railway(other));
});

test('offscreen siding protection survives acknowledgement and Guided pauses once per report',()=>{
  const state=createNetworkState();command(state,'pause');step(state,20);assert.equal(state.time,1);assert.equal(state.paused,true);
  const initial=state.events.find(e=>e.kind==='work-start');command(state,'ack',{eventId:initial.id});assert.equal(initial.resolved,false);
  command(state,'view',{districtId:'relief'});command(state,'view',{districtId:'all'});assert.equal(command(state,'releaseWork').ok,false);
  command(state,'pause');step(state,10);assert.equal(state.time,11);assert.equal(state.paused,false);assert.equal(state.events.filter(e=>e.kind==='work-start').length,1);
  step(state,100);assert.equal(state.time,90);assert.equal(state.paused,true);const clear=state.events.find(e=>e.kind==='work-clear');
  assert.equal(command(state,'releaseWork').ok,false);command(state,'ack',{eventId:clear.id});assert.equal(state.work.active,true);assert.equal(clear.resolved,false);
  assert.equal(command(state,'releaseWork').ok,true);assert.ok(state.events.filter(e=>e.condition==='depot-work').every(e=>e.resolved));
});

test('graph snapshots retain moving paths and reject old schema, lost ownership and corrupt geometry',()=>{
  const state=opposingPair();request(state,'301','kawara:track-2');step(state,5);
  const restored=JSON.parse(JSON.stringify(state));assert.equal(isValidNetworkSave(restored),true);assert.deepEqual(railway(restored),railway(state));
  restored.paused=true;const frozen=structuredClone(railway(restored));step(restored,500);assert.deepEqual(railway(restored),frozen);
  const old=structuredClone(state);old.version=1;assert.equal(isValidNetworkSave(old),false);
  const revision=structuredClone(state);revision.contentRevision++;assert.equal(isValidNetworkSave(revision),false);
  const lost=structuredClone(state);delete lost.reservations[lost.routes[0].resources[0]];assert.equal(isValidNetworkSave(lost),false);
  for(const [field,value] of [['points',{}],['detection',{}],['selected','missing-train']]){const corrupt=createNetworkState();corrupt[field]=value;assert.equal(isValidNetworkSave(corrupt),false,`Invalid ${field}`);}
  const geometry=structuredClone(state);geometry.routes[0].nodeIds=[];assert.equal(isValidNetworkSave(geometry),false,'A restored renderer must receive the actual ordered path nodes');
});

test('every actual path respects its required point positions, including reversed travel',()=>{
  const state=opposingPair();
  for(const train of ['301','402'])for(const option of routeOptions(state,train))for(let variant=0;variant<option.paths.length;variant++){
    const plan=networkRoutePlan(state,train,option.destinationId,variant),requirements=new Map(plan.points.map(p=>[p.id,p.position]));
    assert.equal(plan.from,state.trains.find(t=>t.id===train).nodeId);assert.equal(plan.to,option.destinationId);
    for(const edgeId of plan.edgeIds){const edge=GRAPH.edges.find(e=>e.id===edgeId);if(edge.pointId)assert.equal(requirements.get(edge.pointId),edge.position);}
  }
});

test('all seven graph services complete their real itineraries, with freight physically parked',()=>{
  for(const reversePreference of [false,true]){
  const state=running(),visited=new Map(SERVICES.map(t=>[t.id,[]]));
  for(let tick=0;tick<2500&&!state.complete;tick++){
    for(const event of state.events.filter(e=>e.important&&!e.acknowledged))command(state,'ack',{eventId:event.id});
    if(state.work.active&&state.work.ready)command(state,'releaseWork');
    const priority=t=>t.status==='platform'?(t.leg===t.itinerary.length-1?0:1):2;
    for(const train of [...state.trains].sort((a,b)=>priority(a)-priority(b))){
      if(!['waiting','platform'].includes(train.status)||train.status==='platform'&&train.boarding<train.dwell)continue;
      let accepted=false;
      const options=routeOptions(state,train.id);if(reversePreference)options.reverse();
      for(const option of options){
        const variants=option.paths.map((_,index)=>index);if(reversePreference)variants.reverse();
        for(const variant of variants){
          const plan=networkRoutePlan(state,train.id,option.destinationId,variant);
          if(!checkNetworkRoute(state,plan,{ignorePoints:true}).ok)continue;
          assert.equal(request(state,train.id,option.destinationId,variant).ok,true);visited.get(train.id).push(option.destinationId);accepted=true;break;
        }if(accepted)break;
      }
    }
    step(state);assert.deepEqual(validateNetworkState(state),[],`Graph tick ${state.time}`);
  }
  assert.equal(state.complete,true);assert.equal(state.work.released,true);assert.equal(state.results.total,7);assert.equal(state.results.parked,2);
  assert.ok(state.trains.every(t=>t.status==='done'&&t.leg===t.itinerary.length));
  for(const train of state.trains){assert.equal(visited.get(train.id).length,train.itinerary.length);visited.get(train.id).forEach((node,index)=>assert.ok(targetNodes(train.itinerary[index]).includes(node)));}
  assert.deepEqual(state.reservations,{});
  assert.deepEqual(state.occupancy,{'berth:depot:siding-1':'F71','berth:depot:siding-2':'F82'});
  assert.ok(state.events.every(e=>e.resolved),'Obsolete routine notices must retire without manual acknowledgement');
  }
});
