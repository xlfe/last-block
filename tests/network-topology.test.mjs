import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAPH,SERVICES,validateGraph} from '../app/network-data.mjs';
import {findGraphPaths,targetNodes} from '../app/network-paths.mjs';

function checkPath(graph,path,from,to) {
  assert.equal(path.nodes[0],from);
  assert.equal(path.nodes.at(-1),to);
  assert.equal(path.nodes.length,path.edgeIds.length+1);
  const requirements={},resources=new Set();
  for(let i=0;i<path.edgeIds.length;i++) {
    const edge=graph.edges.find(e=>e.id===path.edgeIds[i]);
    assert.ok(edge,'Every route segment must be a real graph edge');
    assert.ok(edge.from===path.nodes[i]&&edge.to===path.nodes[i+1]||edge.to===path.nodes[i]&&edge.from===path.nodes[i+1],'Route edges must join in order');
    resources.add(edge.resourceId);
    if(edge.pointId) {
      assert.ok(!requirements[edge.pointId]||requirements[edge.pointId]===edge.position,'A route cannot need both legs of one turnout');
      requirements[edge.pointId]=edge.position;
    }
  }
  assert.deepEqual(path.requirements,requirements);
  assert.deepEqual(new Set(path.resources),resources);
  assert.ok(path.nodes.slice(1,-1).every(id=>graph.nodes.find(n=>n.id===id).kind!=='boundary'),'A route cannot pass through an external boundary');
}

test('every offered service stage has connected paths, and all drawn edges have operational coverage',()=>{
  assert.deepEqual(validateGraph(GRAPH),[]);
  const seen=new Set();
  for(const edge of GRAPH.edges) {
    const from=GRAPH.nodes.find(n=>n.id===edge.from),to=GRAPH.nodes.find(n=>n.id===edge.to);
    assert.deepEqual(edge.geometry[0],[from.x,from.y]);
    assert.deepEqual(edge.geometry.at(-1),[to.x,to.y]);
  }
  for(const service of SERVICES) {
    let sources=[service.origin];
    for(const target of service.itinerary) {
      const destinations=targetNodes(target);
      assert.ok(destinations.length,`${service.id}: unknown destination ${target}`);
      let count=0;
      for(const from of sources)for(const to of destinations)for(const path of findGraphPaths(GRAPH,from,to)) {
        checkPath(GRAPH,path,from,to);
        path.edgeIds.forEach(id=>seen.add(id));count++;
      }
      assert.ok(count,`${service.id} cannot reach its advertised ${target}`);
      sources=destinations;
    }
  }
  assert.deepEqual(GRAPH.edges.filter(edge=>!seen.has(edge.id)).map(edge=>edge.id),[],'The intricate map must not rely on decorative-only track branches');
});

test('north, through-relief and both terminal siding itineraries are real reachable service choices',()=>{
  assert.ok(SERVICES.some(s=>s.itinerary.includes('ume')&&s.itinerary.includes('kitayama')&&s.itinerary.includes('boundary:north')));
  assert.ok(SERVICES.some(s=>s.itinerary.includes('depot')&&s.itinerary.includes('kawara')&&s.itinerary.includes('boundary:kyoto')));
  for(const siding of ['depot:siding-1','depot:siding-2']) {
    const train=SERVICES.find(s=>s.itinerary.at(-1)===siding);
    assert.ok(train,`${siding} needs a playable freight destination`);
    const previous=train.itinerary.at(-2),sources=targetNodes(previous);
    assert.ok(sources.some(from=>findGraphPaths(GRAPH,from,siding).length));
  }
});

test('malformed authored topology is rejected before routing or rendering',()=>{
  for(const damage of [
    graph=>{graph.edges[0].geometry=null;},
    graph=>{graph.edges[0]=null;},
    graph=>{delete graph.nodes[0].id;},
    graph=>{delete graph.stations[0].berths;},
    graph=>{graph.nodes.push({id:'isolated-node',x:5,y:5});}
  ]) {
    const graph=structuredClone(GRAPH);damage(graph);
    assert.ok(validateGraph(graph).length,'Bad source data must produce actionable validation errors');
  }
});

test('the generic pathfinder respects turnout ports with unrelated graph IDs and data ordering',()=>{
  const fixture={nodes:[{id:'hub',x:0,y:0},{id:'upper',x:40,y:0},{id:'lower',x:40,y:40}],
    resources:[{id:'fork-resource'}],stations:[],
    points:[{id:'fork'}],edges:[
      {id:'upper-leg',from:'hub',to:'upper',resourceId:'fork-resource',pointId:'fork',position:'normal',geometry:[[0,0],[40,0]]},
      {id:'lower-leg',from:'hub',to:'lower',resourceId:'fork-resource',pointId:'fork',position:'reverse',geometry:[[0,0],[40,40]]}
    ]};
  assert.deepEqual(validateGraph(fixture),[]);
  assert.deepEqual(findGraphPaths(fixture,'upper','lower'),[],'Common-to-normal or common-to-reverse is valid; normal-to-reverse is not');
  const normal=findGraphPaths(fixture,'hub','upper');
  assert.equal(normal.length,1);checkPath(fixture,normal[0],'hub','upper');
  const reordered=structuredClone(fixture);reordered.nodes.reverse();reordered.edges.reverse();
  assert.deepEqual(findGraphPaths(reordered,'hub','upper'),normal);
  assert.equal(findGraphPaths(fixture,'hub','lower')[0].requirements.fork,'reverse');
});
