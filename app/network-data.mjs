/** Fictional authored railway. Geometry, connectivity and controls are data. */
const nodes=[],edges=[],points=[],resources=[],stations=[];
const node=(id,x,y,extra={})=>{nodes.push({id,x,y,...extra});return id;};
function edge(id,from,to,{resourceId=id,line='main',pointId=null,position=null,via=[]}={}){const a=nodes.find(n=>n.id===from),b=nodes.find(n=>n.id===to);if(!resources.some(r=>r.id===resourceId))resources.push({id:resourceId,label:id.replaceAll(':',' '),kind:pointId?'point':'section'});edges.push({id,from,to,resourceId,line,pointId,position,geometry:[[a.x,a.y],...via,[b.x,b.y]]});return id;}
function turnout(id,label,stationId,c,n,r,{normalLabel='Normal / main',reverseLabel='Reverse / diverge',line='main'}={}){
 const common=node(`${id}:c`,...c),normal=node(`${id}:n`,...n),reverse=node(`${id}:r`,...r);
 points.push({id,label,stationId,x:c[0],y:c[1],normalLabel,reverseLabel,defaultPosition:'normal'});
 edge(`${id}:normal`,common,normal,{resourceId:`point:${id}`,pointId:id,position:'normal',line});edge(`${id}:reverse`,common,reverse,{resourceId:`point:${id}`,pointId:id,position:'reverse',line});return {common,normal,reverse};
}
function station(id,name,jp,x,ys){
 const cy=id==='depot'?840:id==='ume'||id==='kitayama'?220:540;
 const s={id,name,jp,x,y:Math.min(...ys)-73,berths:[],district:id==='ume'||id==='kitayama'?'north':id==='depot'?'relief':id==='higashi'?'east':'west'};
 const fan=(side)=>{const sign=side==='west'?-1:1;let branch;
  if(ys.length===2){const p=turnout(`${id}-${side}`,`${name} ${side} points`,id,[x+sign*145,cy],[x+sign*85,ys[0]],[x+sign*85,ys[1]],{normalLabel:'Track 1',reverseLabel:'Track 2'});return {common:p.common,leaves:[p.normal,p.reverse]};}
  const p1=turnout(`${id}-${side}-a`,`${name} ${side} fan A`,id,[x+sign*190,cy],[x+sign*100,ys[0]],[x+sign*140,(ys[1]+ys[2])/2],{normalLabel:'Track 1',reverseLabel:'Tracks 2 / 3'});
  const p2=turnout(`${id}-${side}-b`,`${name} ${side} fan B`,id,[x+sign*140,(ys[1]+ys[2])/2],[x+sign*85,ys[1]],[x+sign*85,ys[2]],{normalLabel:'Track 2',reverseLabel:'Track 3'});edge(`${id}:${side}:fan-link`,p1.reverse,p2.common);return {common:p1.common,leaves:[p1.normal,p2.normal,p2.reverse]};
 };
 const west=fan('west'),east=fan('east');
 ys.forEach((y,i)=>{const berth=node(`${id}:track-${i+1}`,x,y,{kind:'berth',stationId:id,label:`${name} Track ${i+1}`});s.berths.push(berth);edge(`${berth}:west`,west.leaves[i],berth,{resourceId:`berth:${berth}`});edge(`${berth}:east`,berth,east.leaves[i],{resourceId:`berth:${berth}`});});
 s.west=west.common;s.east=east.common;stations.push(s);return s;
}
const mizuno=station('mizuno','Mizuno','水野',350,[500,580]);
const kawara=station('kawara','Kawara Junction','河原',950,[440,500,580]);
const higashi=station('higashi','Higashi','東町',1850,[440,500,580]);
const ume=station('ume','Ume Town','梅町',1300,[180,260]);
const kitayama=station('kitayama','Kitayama','北山',1850,[180,260]);
const depot=station('depot','Freight Depot','貨物区',1500,[800,880]);
const kyoto=node('boundary:kyoto',65,540,{kind:'boundary',label:'Kyoto West'}),nara=node('boundary:nara',2300,540,{kind:'boundary',label:'Nara East'}),north=node('boundary:north',2300,220,{kind:'boundary',label:'North line'});
edge('kyoto-approach',kyoto,mizuno.west);edge('nara-approach',higashi.east,nara);edge('north-approach',kitayama.east,north,{line:'north'});
const mx=turnout('mx','Mizuno line selector','mizuno',[535,540],[590,500],[590,580],{normalLabel:'Upper main',reverseLabel:'Lower main'});
const kx=turnout('kx','Kawara west line selector','kawara',[715,540],[660,500],[660,580],{normalLabel:'Upper main',reverseLabel:'Lower main'});
edge('mizuno-east-approach',mizuno.east,mx.common);edge('west-upper-main',mx.normal,kx.normal);edge('west-lower-main',mx.reverse,kx.reverse,{line:'relief'});edge('kawara-west-approach',kx.common,kawara.west);
const kj=turnout('kj','Kawara main / branches','kawara',[1200,540],[1240,400],[1260,540],{normalLabel:'North branch',reverseLabel:'Main / depot relief'});
const kb=turnout('kb','Kawara branch junction','kawara',[1260,540],[1320,500],[1290,705],{normalLabel:'Main line',reverseLabel:'Depot relief'});
edge('kawara-east-approach',kawara.east,kj.common);edge('branch-junction-link',kj.reverse,kb.common,{line:'relief'});
edge('north-branch',kj.normal,ume.west,{line:'north',via:[[1170,330],[1155,270]]});edge('north-single-line',ume.east,kitayama.west,{line:'north'});
const cx=turnout('cx','Main line east selector','kawara',[1320,500],[1380,500],[1380,580],{normalLabel:'Upper main',reverseLabel:'Lower main'});
const hx=turnout('hx','Higashi main line selector','higashi',[1490,500],[1430,500],[1430,580],{normalLabel:'Upper main',reverseLabel:'Lower main'});
const hj=turnout('hj','Higashi main / relief','higashi',[1600,540],[1540,500],[1540,680],{normalLabel:'Main line',reverseLabel:'Depot relief'});
edge('main-junction-approach',kb.normal,cx.common);edge('east-upper-main',cx.normal,hx.normal);edge('east-lower-main',cx.reverse,hx.reverse,{line:'relief'});edge('higashi-main-approach',hx.common,hj.normal);edge('higashi-west-approach',hj.common,higashi.west);
edge('depot-west-relief',kb.reverse,depot.west,{line:'relief',via:[[1320,760]]});
const dy=turnout('dy','Depot relief / sidings','depot',[1700,840],[1730,760],[1740,970],{normalLabel:'Higashi relief',reverseLabel:'Terminal sidings',line:'relief'});
const ds=turnout('ds','Depot siding fork','depot',[1780,970],[1860,960],[1860,1040],{normalLabel:'Siding 1',reverseLabel:'Siding 2',line:'siding'});
edge('depot-east-relief',depot.east,dy.common,{line:'relief'});edge('depot-through-relief',dy.normal,hj.reverse,{line:'relief',via:[[1630,710]]});edge('siding-neck',dy.reverse,ds.common,{line:'siding'});
for(const n of [1,2]){const berth=node(`depot:siding-${n}`,2050,n===1?960:1040,{kind:'berth',stationId:'depot',label:`Freight Depot Siding ${n}`,terminal:true});depot.berths.push(berth);edge(`depot-siding-${n}`,n===1?ds.normal:ds.reverse,berth,{line:'siding',resourceId:`berth:${berth}`});}
points.forEach((p,i)=>{p.displayId=`P${String(i+1).padStart(2,'0')}`;});
const corridorLabels={'west-upper-main':'Upper main','east-upper-main':'Upper main','west-lower-main':'Lower main','east-lower-main':'Lower main','north-branch':'North branch','north-single-line':'North branch','depot-west-relief':'Depot relief','depot-through-relief':'Depot relief','depot-siding-1':'Terminal sidings','depot-siding-2':'Terminal sidings'};
for(const e of edges)if(corridorLabels[e.id])e.routeLabel=corridorLabels[e.id];
export const GRAPH={id:'kawara-district',revision:1,name:'Kawara junction district',width:2400,height:1120,nodes,edges,points,resources,stations,boundaries:[kyoto,nara,north],districts:[{id:'all',name:'Whole network',bounds:[0,50,2400,1070]},{id:'west',name:'Mizuno / Kawara',bounds:[0,330,1390,470]},{id:'east',name:'Higashi',bounds:[1260,330,1130,470]},{id:'north',name:'North branch',bounds:[1080,70,1320,640]},{id:'relief',name:'Depot / relief',bounds:[1120,610,1100,500]}]};
export const SERVICES=[
 {id:'301',kind:'Local',arrival:5,due:310,origin:kyoto,itinerary:['mizuno','kawara','higashi',nara]},
 {id:'402',kind:'Local',arrival:25,due:360,origin:nara,itinerary:['higashi','kawara','mizuno',kyoto]},
 {id:'311',kind:'Branch local',arrival:80,due:480,origin:kyoto,itinerary:['mizuno','kawara','ume','kitayama',north]},
 {id:'412',kind:'Branch local',arrival:115,due:520,origin:north,itinerary:['kitayama','ume','kawara','higashi',nara]},
 {id:'F71',kind:'Freight',arrival:170,due:600,origin:kyoto,itinerary:['mizuno','kawara','depot:siding-1']},
 {id:'F82',kind:'Freight',arrival:220,due:650,origin:nara,itinerary:['higashi','depot','depot:siding-2']},
 {id:'421',kind:'Relief local',arrival:270,due:740,origin:nara,itinerary:['higashi','depot','kawara','mizuno',kyoto]}
];
export function validateGraph(graph){
 const errors=[],unique=(items,key,kind)=>{const ids=items.map(x=>x[key]);if(new Set(ids).size!==ids.length)errors.push(`Duplicate ${kind}`);};
 if(!graph||!Array.isArray(graph.nodes)||!Array.isArray(graph.edges)||!Array.isArray(graph.points)||!Array.isArray(graph.resources)||!Array.isArray(graph.stations))return ['Missing graph collections'];
 for(const key of ['nodes','edges','points','resources','stations'])if(graph[key].some(x=>!x||typeof x.id!=='string'||!x.id))return [`Invalid ${key} record`];
 unique(graph.stations,'id','station');unique(graph.nodes,'id','node');unique(graph.edges,'id','edge');unique(graph.points,'id','point');unique(graph.resources,'id','resource');
 const ns=new Set(graph.nodes.map(n=>n.id)),rs=new Set(graph.resources.map(r=>r.id)),ps=new Set(graph.points.map(p=>p.id));
 for(const n of graph.nodes)if(!Number.isFinite(n.x)||!Number.isFinite(n.y))errors.push(`Bad geometry ${n.id}`);
 for(const e of graph.edges){if(!ns.has(e.from)||!ns.has(e.to)||!rs.has(e.resourceId))errors.push(`Bad references ${e.id}`);const geometryValid=Array.isArray(e.geometry)&&e.geometry.length>=2&&e.geometry.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite));if(!geometryValid)errors.push(`Bad edge geometry ${e.id}`);const a=graph.nodes.find(n=>n.id===e.from),b=graph.nodes.find(n=>n.id===e.to);if(geometryValid&&a&&b&&(e.geometry[0][0]!==a.x||e.geometry[0][1]!==a.y||e.geometry.at(-1)[0]!==b.x||e.geometry.at(-1)[1]!==b.y))errors.push(`Geometry disconnected from ports ${e.id}`);if(e.pointId&&(!ps.has(e.pointId)||!['normal','reverse'].includes(e.position)))errors.push(`Bad turnout leg ${e.id}`);}
 for(const p of graph.points){const legs=graph.edges.filter(e=>e.pointId===p.id);if(legs.length!==2||!legs.some(e=>e.position==='normal')||!legs.some(e=>e.position==='reverse')||legs[0].from!==legs[1].from||legs[0].resourceId!==legs[1].resourceId)errors.push(`Bad turnout ports ${p.id}`);}
 for(const s of graph.stations)if(!Array.isArray(s.berths)||!s.berths.length||!s.berths.every(id=>ns.has(id)&&graph.nodes.find(n=>n.id===id).stationId===s.id))errors.push(`Bad station ${s.id}`);
 if(graph.nodes.length){const reached=new Set([graph.nodes[0].id]);let changed=true;while(changed){changed=false;for(const e of graph.edges){if(reached.has(e.from)&&!reached.has(e.to)){reached.add(e.to);changed=true;}if(reached.has(e.to)&&!reached.has(e.from)){reached.add(e.from);changed=true;}}}if(reached.size!==graph.nodes.length)errors.push('Disconnected topology');}
 return errors;
}
const graphErrors=validateGraph(GRAPH);if(graphErrors.length)throw Error(graphErrors.join('; '));
