import {GRAPH,validateGraph} from './network-data.mjs';
const caches=new WeakMap();
export const edgeLength=edge=>edge.geometry.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p[0]-edge.geometry[i][0],p[1]-edge.geometry[i][1]),0);
/** Bounded uniform-cost simple paths with consistent C↔N / C↔R turnout settings. */
export function findGraphPaths(graph,from,to,{limit=4}={}){
 if(validateGraph(graph).length)return [];
 let cache=caches.get(graph);if(!cache){cache=new Map();caches.set(graph,cache);}const key=`${from}|${to}|${limit}`;if(cache.has(key))return cache.get(key);
 if(!graph.nodes.some(n=>n.id===from)||!graph.nodes.some(n=>n.id===to)||from===to)return [];
 const adjacent=new Map(graph.nodes.map(n=>[n.id,[]]));for(const e of graph.edges){adjacent.get(e.from).push({edge:e,next:e.to});adjacent.get(e.to).push({edge:e,next:e.from});}
 const queue=[{node:from,nodes:[from],edges:[],requirements:{},length:0}],found=[];let expanded=0,firstLength=null;
 while(queue.length&&found.length<limit&&expanded++<16000){
  queue.sort((a,b)=>a.length-b.length||a.edges.join().localeCompare(b.edges.join()));const p=queue.shift();
  if(firstLength!==null&&p.length>firstLength*2.8+200)break;
  if(p.node===to){firstLength??=p.length;found.push({nodes:p.nodes,edgeIds:p.edges,requirements:p.requirements,length:p.length,resources:[...new Set(p.edges.map(id=>graph.edges.find(e=>e.id===id).resourceId))]});continue;}
  for(const {edge,next} of adjacent.get(p.node)){
   if(p.nodes.includes(next)||p.edges.length>=65)continue;
   const n=graph.nodes.find(n=>n.id===next);if(n.kind==='boundary'&&next!==to)continue;
   if(edge.pointId&&p.requirements[edge.pointId]&&p.requirements[edge.pointId]!==edge.position)continue;
   queue.push({node:next,nodes:[...p.nodes,next],edges:[...p.edges,edge.id],requirements:edge.pointId?{...p.requirements,[edge.pointId]:edge.position}:p.requirements,length:p.length+Math.max(1,edgeLength(edge))});
  }
 }
 cache.set(key,found);return found;
}
export function graphNode(id){return GRAPH.nodes.find(n=>n.id===id);}
export function graphStation(id){return GRAPH.stations.find(s=>s.id===id);}
export function targetNodes(target){const station=graphStation(target);return station?station.berths.filter(id=>!graphNode(id).terminal):graphNode(target)?[target]:[];}
