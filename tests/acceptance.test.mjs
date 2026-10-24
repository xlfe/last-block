import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENARIOS, createState, command, step, validateState, throatFor, trackOccupied} from '../app/sim.mjs';

function running(index=0) {
  const state=createState(index);
  command(state,'pause');
  return state;
}
function select(state,id) { command(state,'select',{id}); }
function route(state,id,track=1) {
  select(state,id);
  const train=state.trains.find(t=>t.id===id);
  const side=throatFor(train,train.status==='waiting'?'arrival':'departure');
  command(state,'point',{side,track});
  return command(state,'route',{track});
}

test('pause preserves the entire railway across elapsed wall-time requests',()=>{
  const state=createState();
  const before=structuredClone(state);
  step(state,600);
  assert.deepEqual(state,before);
});

test('route requires points, proves before authority, locks points until tail clearance',()=>{
  const state=running();
  step(state,5);
  assert.equal(command(state,'route',{track:2}).ok,false);
  assert.equal(route(state,'101',2).ok,true);
  assert.equal(state.routes[0].state,'proving');
  assert.equal(command(state,'point',{side:'west',track:1}).ok,false);
  step(state);
  assert.equal(state.routes[0].state,'proving');
  step(state);
  assert.equal(state.routes[0].state,'locked');
  assert.equal(command(state,'point',{side:'west',track:1}).ok,false);
  step(state,11);
  assert.equal(state.trains[0].status,'arriving');
  assert.equal(trackOccupied(state,2),true);
  step(state);
  assert.equal(state.trains[0].status,'platform');
  assert.equal(state.routes.length,0);
  assert.equal(command(state,'point',{side:'west',track:1}).ok,true);
  assert.deepEqual(validateState(state),[]);
});

test('opposing arrivals cannot reserve the same station track',()=>{
  const state=running(1);
  step(state,11);
  assert.equal(route(state,'103',1).ok,true);
  assert.equal(route(state,'202',1).ok,false);
  assert.equal(route(state,'202',2).ok,true);
  assert.equal(state.routes.length,2);
  assert.deepEqual(validateState(state),[]);
  // Both approaches are locked, so neither can be moved by a rapid repeat tap.
  for(let i=0;i<20;i++) {
    assert.equal(command(state,'point',{side:'east',track:1}).ok,false);
    assert.equal(command(state,'point',{side:'west',track:2}).ok,false);
  }
  assert.deepEqual(validateState(state),[]);
});

test('work acknowledgement and completion report do not release protection',()=>{
  const state=running(2);
  step(state,10);
  assert.equal(command(state,'call').ok,true);
  assert.equal(state.work.active,true);
  assert.equal(command(state,'release').ok,false);
  assert.equal(route(state,'204',2).ok,false);
  step(state,38);
  assert.equal(state.work.ready,true);
  assert.equal(command(state,'release').ok,false);
  assert.equal(command(state,'call').ok,true);
  assert.equal(state.work.active,true);
  assert.equal(command(state,'release').ok,true);
  assert.equal(route(state,'204',2).ok,true);
});

test('opposing departure and arrival cannot share the same throat or single-line section',()=>{
  const state=running(1);
  step(state,4);
  assert.equal(route(state,'103',1).ok,true);
  step(state,22);
  assert.equal(route(state,'103',1).ok,true);
  // 103 departs east towards Nara while 202 waits at that boundary.
  assert.equal(route(state,'202',2).ok,false);
  step(state,13);
  assert.equal(route(state,'202',2).ok,false);
  step(state);
  assert.equal(route(state,'202',2).ok,true);
  assert.deepEqual(validateState(state),[]);
});

test('supply loss preserves locked routes and acknowledgement cannot repair it',()=>{
  const state=running(3);
  step(state,20);
  assert.equal(route(state,'109',1).ok,true);
  step(state,7);
  assert.equal(state.power.source,'none');
  assert.equal(state.routes.length,1);
  assert.equal(command(state,'call').ok,true);
  assert.equal(state.power.source,'none');
  assert.equal(command(state,'transfer').ok,false);
  assert.equal(command(state,'generator').ok,true);
  step(state,9);
  assert.equal(state.power.generator,'starting');
  assert.equal(command(state,'transfer').ok,false);
  step(state);
  assert.equal(state.power.generator,'ready');
  assert.equal(state.power.source,'none');
  assert.equal(command(state,'transfer').ok,true);
  assert.equal(state.power.source,'standby');
  assert.deepEqual(validateState(state),[]);
});

test('work shift cannot be handed over with its protection still active',()=>{
  const state=running(2);
  for(let tick=0;tick<1000&&!state.trains.every(t=>t.status==='done');tick++) {
    const standing=state.trains.find(t=>t.status==='platform'&&t.phase>=t.dwell);
    if(standing)route(state,standing.id,1);
    const waiting=state.trains.find(t=>t.status==='waiting');
    if(waiting&&!trackOccupied(state,1))route(state,waiting.id,1);
    step(state);
  }
  assert.equal(state.trains.every(t=>t.status==='done'),true);
  assert.equal(state.work.active,true);
  assert.equal(state.complete,false);
  while(state.calls.some(c=>!c.read))command(state,'call');
  assert.equal(command(state,'release').ok,true);
  assert.equal(state.complete,true);
});

test('the same delay costs more for a passenger service than a freight service',()=>{
  function delayedService(kind) {
    const state=running();
    // Author two otherwise identical isolated scoring fixtures.
    state.trains[0].kind=kind;
    state.trains[0].due=1;
    step(state,5);
    route(state,'101',1);
    step(state,22);
    route(state,'101',1);
    step(state,14);
    assert.equal(state.complete,true);
    return state;
  }
  const passenger=delayedService('Local'),freight=delayedService('Freight');
  assert.equal(passenger.results.delay,freight.results.delay);
  assert.ok(passenger.score<freight.score);
});

test('every shift is completable using only legal operator commands in both modes',()=>{
  for(const difficulty of ['guided','dispatcher']) for(let index=0;index<SCENARIOS.length;index++) {
    const state=createState(index,difficulty);
    command(state,'pause');
    for(let tick=0;tick<1000&&!state.complete;tick++) {
      while(state.calls.some(call=>!call.read)) command(state,'call');
      if(state.work.ready&&state.work.active) command(state,'release');
      if(state.power.source==='none') {
        if(state.power.generator==='off')command(state,'generator');
        if(state.power.generator==='ready')command(state,'transfer');
      }
      // Clear standing trains first, then accept arrivals into free tracks.
      const candidates=[...state.trains].sort((a,b)=>(a.status==='platform'?-1:0)-(b.status==='platform'?-1:0));
      for(const train of candidates) {
        if(train.status==='platform'&&train.phase>=train.dwell)route(state,train.id,train.track);
        if(train.status==='waiting') {
          const track=[1,2].find(t=>!trackOccupied(state,t)&&!(state.work.active&&t===2));
          if(track)route(state,train.id,track);
        }
      }
      step(state);
      assert.deepEqual(validateState(state),[],`${difficulty} shift ${index} at ${state.time}`);
    }
    assert.equal(state.complete,true,`${difficulty} shift ${index} deadlocked`);
    assert.equal(state.paused,true);
    assert.equal(state.results.total,SCENARIOS[index].trains.length);
    assert.equal(state.trains.every(t=>t.status==='done'),true);
    assert.ok(Number.isFinite(state.score));
    assert.ok(state.score>=0&&state.score<=100);
  }
});

test('rapid mixed valid/invalid commands preserve route exclusion over a long run',()=>{
  const state=running(3);
  let seed=2197;
  const random=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};
  for(let n=0;n<4000&&!state.complete;n++) {
    const train=state.trains[random(state.trains.length)];
    select(state,train.id);
    const action=random(8);
    if(action===0)command(state,'point',{side:random(2)?'west':'east',track:random(2)+1});
    if(action===1)command(state,'route',{track:random(2)+1});
    if(action===2)command(state,'generator');
    if(action===3)command(state,'transfer');
    if(action===4)command(state,'call');
    if(action===5)command(state,'release');
    if(action>=6)step(state);
    assert.deepEqual(validateState(state),[],`command ${n}`);
    assert.equal(new Set(state.routes.map(r=>r.side)).size,state.routes.length);
    assert.equal(new Set(state.routes.map(r=>r.train)).size,state.routes.length);
  }
});
