/** One authored, connected railway. All time and commands are deterministic. */
export const NETWORK_VERSION=1;
export const DISTRICTS=[
 {id:'mizuno',name:'Mizuno',jp:'水野',subtitle:'Western district',west:'Kyoto boundary',east:'Higashi link'},
 {id:'higashi',name:'Higashi',jp:'東町',subtitle:'Eastern district',west:'Mizuno link',east:'Nara boundary'}
];
export const NETWORK={id:'morning-link',revision:1,title:'The connecting line',link:'link:mizuno-higashi',districts:DISTRICTS};
const roster=[
 {id:'301',direction:'east',arrival:5,due:116,kind:'Local'},
 {id:'402',direction:'west',arrival:12,due:130,kind:'Local'},
 {id:'303',direction:'east',arrival:64,due:195,kind:'Local'},
 {id:'F71',direction:'west',arrival:81,due:230,kind:'Freight'},
 {id:'305',direction:'east',arrival:133,due:285,kind:'Local'},
 {id:'406',direction:'west',arrival:150,due:310,kind:'Local'}
];
export const trackId=(district,track)=>`${district}:track-${track}`;
export const pointId=(district,side)=>`${district}:point-${side}`;
export const throatId=(district,side)=>`${district}:throat-${side}`;
export const otherDistrict=id=>id==='mizuno'?'higashi':'mizuno';
const outerSide=t=>t.direction==='east'?'west':'east';
const innerSide=t=>t.direction==='east'?'east':'west';
const origin=t=>t.direction==='east'?'mizuno':'higashi';
const destination=t=>otherDistrict(origin(t));
export const districtName=id=>DISTRICTS.find(d=>d.id===id)?.name||id;
export function resourceName(id){if(id===NETWORK.link)return 'Connecting line';const [district,part]=id.split(':');return `${districtName(district)} ${part?.startsWith('track-')?`Track ${part.slice(6)}`:part?.replace('throat-','entrance / exit ')||''}`;}
export function createNetworkState({assistance='guided',pace='steady'}={}){
 const resources=DISTRICTS.flatMap(d=>[trackId(d.id,1),trackId(d.id,2),throatId(d.id,'west'),throatId(d.id,'east')]);resources.push(NETWORK.link);
 return {version:NETWORK_VERSION,networkId:NETWORK.id,contentRevision:NETWORK.revision,time:0,paused:true,complete:false,assistance:assistance==='independent'?'independent':'guided',pace:pace==='brisk'?'brisk':'steady',view:'mizuno',selected:'301',preview:null,sequence:0,eventSequence:0,revision:0,pauseReason:'Briefing',routes:[],reservations:{},occupancy:{},detection:Object.fromEntries(resources.map(id=>[id,'clear'])),points:Object.fromEntries(DISTRICTS.flatMap(d=>['west','east'].map(side=>[pointId(d.id,side),{position:1,proved:1,owner:null}]))),trains:roster.map(t=>({...t,status:'scheduled',district:origin(t),track:null,stops:0,dwell:t.kind==='Freight'?5:8,boarding:0,departedAt:null})),work:{active:true,ready:false,released:false},events:[],journal:[],feedback:'One railway, two districts. Read the brief, then Resume.',refusals:0,results:null};
}
function note(s,text,type='info'){s.feedback=text;s.journal.unshift({id:`journal-${++s.sequence}`,time:s.time,text,type});s.journal=s.journal.slice(0,100);}
function event(s,{kind,location,title,detail,important=true,condition=null,trainId=null}){
 const id=`event-${++s.eventSequence}`;s.events.push({id,time:s.time,kind,location,title,detail,important,condition,trainId,acknowledged:false,resolved:false,pausedOnce:false});
 note(s,`${districtName(location)}: ${title}`,'attention');
 const e=s.events.at(-1);if(important&&s.assistance==='guided'&&!e.pausedOnce){e.pausedOnce=true;s.paused=true;s.pauseReason=title;}
 return e;
}
function refuse(s,text,resourceId=null){s.refusals++;note(s,text,'refused');return {ok:false,message:text,resourceId};}
export function selectedNetworkTrain(s){return s.trains.find(t=>t.id===s.selected);}
export function activeNetworkEvents(s){return s.events.filter(e=>!e.resolved);}
export function resourceOwner(s,id){const routeId=s.reservations[id];return s.routes.find(r=>r.id===routeId)||null;}
export function pointLock(s,district,side){return s.points[pointId(district,side)]?.owner||null;}
export function networkRoutePlan(s,trainId,track=1){
 const t=s.trains.find(t=>t.id===trainId);if(!t)return {error:'Select a service on the timetable.'};
 if(!['waiting','platform'].includes(t.status))return {error:t.status==='scheduled'?`${t.id} has not reached the boundary yet.`:`${t.id} is already moving or has left the railway.`};
 if(![1,2].includes(track))return {error:'Choose Track 1 or Track 2.'};
 const kind=t.status==='waiting'?'arrival':t.stops===1?'transfer':'exit';
 const from=t.district,to=kind==='transfer'?otherDistrict(from):from;
 const fromSide=kind==='arrival'?outerSide(t):kind==='transfer'?innerSide(t):t.direction==='east'?'east':'west';
 const toSide=kind==='transfer'?(t.direction==='east'?'west':'east'):fromSide;
 const targetTrack=kind==='exit'?t.track:track;
 const points=kind==='transfer'?[{district:from,side:fromSide,track:t.track},{district:to,side:toSide,track:targetTrack}]:[{district:from,side:fromSide,track:targetTrack}];
 const resources=kind==='transfer'?[trackId(from,t.track),throatId(from,fromSide),NETWORK.link,throatId(to,toSide),trackId(to,targetTrack)]:kind==='arrival'?[throatId(from,fromSide),trackId(from,targetTrack)]:[trackId(from,t.track),throatId(from,fromSide)];
 return {trainId:t.id,kind,from,to,fromSide,toSide,sourceTrack:t.track,targetTrack,points,resources,duration:kind==='transfer'?26:14,signature:`${t.id}:${t.status}:${t.district}:${t.track}:${t.stops}`};
}
export function checkNetworkRoute(s,plan){
 if(plan.error)return {ok:false,message:plan.error};
 const t=s.trains.find(t=>t.id===plan.trainId);
 if(t.status==='platform'&&t.boarding<t.dwell)return {ok:false,message:`${t.id}: boarding, ready in ${Math.ceil(t.dwell-t.boarding)} seconds.`};
 if(s.work.active&&plan.resources.includes(trackId('higashi',2)))return {ok:false,message:'Higashi Track 2 is protected. Wait for the foreman’s clear report, acknowledge it, then release protection.',resourceId:trackId('higashi',2)};
 for(const id of plan.resources){
  if(s.detection[id]!=='clear')return {ok:false,message:`${resourceName(id)} detection unknown. No route can be proved.`,resourceId:id};
  const owner=resourceOwner(s,id);if(owner)return {ok:false,message:`${resourceName(id)} reserved for ${owner.trainId}. Wait for tail clearance.`,resourceId:id};
  if(s.occupancy[id]&&s.occupancy[id]!==t.id)return {ok:false,message:`${resourceName(id)} occupied by ${s.occupancy[id]}. Choose another berth or wait.`,resourceId:id};
 }
 if(plan.kind==='arrival'){
  const free=[1,2].filter(track=>!s.occupancy[trackId(plan.to,track)]&&!s.reservations[trackId(plan.to,track)]).length;
  const neighbour=s.trains.find(train=>train.direction!==t.direction&&train.district===otherDistrict(plan.to)&&((train.status==='platform'&&train.stops===1)||s.routes.some(r=>r.trainId===train.id&&r.kind==='arrival')));
  if(free<=1&&neighbour)return {ok:false,message:`Keep the last ${districtName(plan.to)} berth free for ${neighbour.id} from ${districtName(neighbour.district)}. Transfer it before accepting another boundary train.`,resourceId:trackId(plan.to,plan.targetTrack)};
 }
 for(const p of plan.points){const point=s.points[pointId(p.district,p.side)];if(point.owner)return {ok:false,message:`${districtName(p.district)} ${p.side} points are locked.`,resourceId:pointId(p.district,p.side)};if(point.proved!==p.track)return {ok:false,message:`Set ${districtName(p.district)} ${p.side} points to Track ${p.track}.`,resourceId:pointId(p.district,p.side)};}
 return {ok:true,message:'Path available. Confirm to reserve it and begin route proof.'};
}
export function networkCommand(s,type,payload={}){
 if(type==='view'){
  if(!DISTRICTS.some(d=>d.id===payload.districtId))return refuse(s,'Unknown district.');
  const hadPreview=Boolean(s.preview);s.view=payload.districtId;s.preview=null;if(hadPreview)note(s,'District changed. Unconfirmed path preview cleared; no route was set.');return {ok:true};
 }
 if(type==='select'){if(!s.trains.some(t=>t.id===payload.trainId))return refuse(s,'Unknown train.');s.selected=payload.trainId;s.preview=null;return {ok:true};}
 if(type==='pause'){s.paused=!s.paused;s.pauseReason=s.paused?'Manual pause':null;return {ok:true};}
 if(type==='cancelPreview'){s.preview=null;note(s,'Path preview cleared. No route was set.');return {ok:true};}
 if(type==='ack'){
  const e=s.events.find(e=>e.id===payload.eventId);if(!e)return refuse(s,'That message is no longer available.');e.acknowledged=true;if(!e.condition)e.resolved=true;note(s,`Acknowledged: ${e.title}. ${e.condition?'The underlying condition still needs action.':''}`);return {ok:true};
 }
 if(s.complete)return {ok:false,message:'All services clear. Read the handover.'};
 if(type==='point'){
  const p=s.points[pointId(payload.districtId,payload.side)];if(!p||![1,2].includes(payload.track))return refuse(s,'Choose a labelled point position.');
  if(p.owner)return refuse(s,`${districtName(payload.districtId)} ${payload.side} points locked. Wait for tail clearance.`,pointId(payload.districtId,payload.side));
  p.position=payload.track;p.proved=payload.track;s.revision++;note(s,`${districtName(payload.districtId)} ${payload.side} points set for Track ${payload.track}.`);return {ok:true};
 }
 if(type==='preview'){
  const plan=networkRoutePlan(s,payload.trainId||s.selected,Number(payload.track)||1);if(plan.error)return refuse(s,plan.error);
  s.preview={...plan,id:`preview-${++s.sequence}`,createdAtRevision:s.revision};note(s,`${plan.trainId}: preview ${plan.kind==='transfer'?`${districtName(plan.from)} → ${districtName(plan.to)}`:plan.kind==='arrival'?'receive':'departure'}${plan.kind!=='exit'?` Track ${plan.targetTrack}`:''}. Nothing reserved.`);return {ok:true,previewId:s.preview.id};
 }
 if(type==='confirm'){
  const preview=s.preview;if(!preview||payload.previewId!==preview.id)return refuse(s,'That preview is no longer current. Choose the path again.');
  const plan=networkRoutePlan(s,preview.trainId,preview.targetTrack);
  if(plan.error||plan.signature!==preview.signature){s.preview=null;return refuse(s,'The train’s position has changed. Choose a fresh path.');}
  const check=checkNetworkRoute(s,plan);if(!check.ok)return refuse(s,check.message,check.resourceId);
  const id=`route-${++s.sequence}`,route={...plan,id,elapsed:0,state:'proving'};
  // Nothing mutates until every resource has passed the complete check above.
  for(const resource of plan.resources)s.reservations[resource]=id;
  for(const p of plan.points)s.points[pointId(p.district,p.side)].owner=id;
  for(const e of s.events)if(e.trainId===plan.trainId&&!e.condition)e.resolved=true;
  s.routes.push(route);const train=s.trains.find(t=>t.id===plan.trainId);train.status='proving';s.preview=null;s.revision++;
  note(s,`${train.id}: path reserved. Proving points in ${plan.kind==='transfer'?'both districts':districtName(plan.from)}…`,'good');return {ok:true,routeId:id};
 }
 if(type==='releaseWork'){
  if(!s.work.active)return refuse(s,'Higashi Track 2 has no active protection.');
  if(!s.work.ready)return refuse(s,'The foreman has not reported everyone and all tools clear. Keep protection applied.');
  if(!s.events.some(e=>e.kind==='work-clear'&&e.acknowledged))return refuse(s,'Acknowledge the foreman’s completion report before releasing protection.');
  s.work.active=false;s.work.released=true;for(const e of s.events)if(e.condition==='work-higashi-2')e.resolved=true;s.revision++;note(s,'Higashi Track 2 protection released. Both station tracks are available.','good');conclude(s);return {ok:true};
 }
 return {ok:false,message:'Unknown network command.'};
}
function updateMovementOccupancy(s,r){
 for(const [id,trainId] of Object.entries(s.occupancy))if(trainId===r.trainId)delete s.occupancy[id];
 if(r.kind==='arrival'){
  if(r.elapsed<=6)s.occupancy[throatId(r.from,r.fromSide)]=r.trainId;
  if(r.elapsed>=5)s.occupancy[trackId(r.to,r.targetTrack)]=r.trainId;
 }else if(r.kind==='exit'){
  if(r.elapsed<=6)s.occupancy[trackId(r.from,r.sourceTrack)]=r.trainId;
  s.occupancy[throatId(r.from,r.fromSide)]=r.trainId;
 }else{
  if(r.elapsed<=6)s.occupancy[trackId(r.from,r.sourceTrack)]=r.trainId;
  if(r.elapsed<=9)s.occupancy[throatId(r.from,r.fromSide)]=r.trainId;
  if(r.elapsed>=5&&r.elapsed<=22)s.occupancy[NETWORK.link]=r.trainId;
  if(r.elapsed>=19)s.occupancy[throatId(r.to,r.toSide)]=r.trainId;
  if(r.elapsed>=22)s.occupancy[trackId(r.to,r.targetTrack)]=r.trainId;
 }
}
function conclude(s){
 if(!s.trains.every(t=>t.status==='done')||!s.work.released)return;
 const delay=s.trains.reduce((n,t)=>n+Math.max(0,t.departedAt-t.due),0),weighted=s.trains.reduce((n,t)=>n+Math.max(0,t.departedAt-t.due)*(t.kind==='Freight'?1:2),0);
 s.complete=true;s.paused=true;s.pauseReason='Handover';s.preview=null;s.results={total:s.trains.length,punctual:s.trains.filter(t=>t.departedAt<=t.due).length,delay,score:Math.max(0,100-Math.round(weighted/12))};note(s,'All six services clear. Higashi protection released. Network handover complete.','good');
}
export function stepNetwork(s,seconds=1){
 if(s.paused||s.complete)return s;
 for(let tick=0;tick<seconds;tick++){
  s.time++;
  for(const t of s.trains)if(t.status==='scheduled'&&t.arrival<=s.time){t.status='waiting';event(s,{kind:'train-ready',location:t.district,title:`${t.id} waiting at the boundary`,detail:`${t.kind} ${t.direction==='east'?'eastbound':'westbound'}. Select the service and receive it on a clear track.`,important:false,trainId:t.id});}
  if(s.time===1)event(s,{kind:'work-start',location:'higashi',title:'Track 2 work protection',detail:'Foreman: Track 2 inspection under way. Keep protection applied until my completion report.',condition:'work-higashi-2'});
  if(s.time===42){s.work.ready=true;for(const e of s.events)if(e.kind==='work-start')e.resolved=true;event(s,{kind:'work-clear',location:'higashi',title:'Foreman reports Track 2 clear',detail:'Everyone and all tools are clear. Acknowledge this report, then release the protection.',condition:'work-higashi-2'});}
  for(const t of s.trains)if(t.status==='platform')t.boarding++;
  const finished=[];
  for(const r of s.routes){
   r.elapsed++;if(r.elapsed===2){r.state='locked';note(s,`${r.trainId}: points proved. Signals clear; route locked.`,'good');}
   if(r.elapsed>=3){r.state='occupied';s.trains.find(t=>t.id===r.trainId).status='moving';updateMovementOccupancy(s,r);}
   if(r.elapsed>=r.duration){
    const t=s.trains.find(t=>t.id===r.trainId);for(const [id,trainId] of Object.entries(s.occupancy))if(trainId===t.id)delete s.occupancy[id];
    for(const resource of r.resources)delete s.reservations[resource];for(const p of r.points)s.points[pointId(p.district,p.side)].owner=null;
    if(r.kind==='exit'){t.status='done';t.departedAt=s.time;note(s,`${t.id} clear of the railway. Points and route released.`,'good');}
    else{t.status='platform';t.district=r.to;t.track=r.targetTrack;t.stops++;t.boarding=0;s.occupancy[trackId(t.district,t.track)]=t.id;event(s,{kind:'train-arrived',location:t.district,title:`${t.id} arrived Track ${t.track}`,detail:`Tail clear. ${t.stops===1?'Next movement crosses the connecting line.':'Next movement leaves the railway.'}`,important:false,trainId:t.id});}
    finished.push(r.id);s.revision++;
   }
  }
  s.routes=s.routes.filter(r=>!finished.includes(r.id));conclude(s);
  // A Guided pause is global and takes effect after the complete atomic tick.
  if(s.paused||s.complete)break;
 }
 return s;
}
export function networkHint(s){
 if(s.complete)return 'All six services are clear. Your network handover is ready.';
 const important=activeNetworkEvents(s).find(e=>e.important&&!e.acknowledged);if(important)return `${districtName(important.location)} needs attention: ${important.title}. Locate the report in the attention rail.`;
 if(s.work.ready&&s.work.active)return 'The foreman has reported clear. Acknowledge that completion report, then release Higashi Track 2.';
 const t=selectedNetworkTrain(s);if(!t)return 'Select a train on the working timetable.';
 if(t.status==='scheduled')return `${t.id} is due at the boundary in ${Math.max(0,t.arrival-s.time)} railway seconds. Resume the clock to wait.`;
 if(['moving','proving'].includes(t.status))return `${t.id} has a protected path. Wait for its tail to clear, or select another train; both districts share the same clock.`;
 if(t.status==='done')return 'Select the next waiting or standing service. The attention rail follows both districts.';
 if(t.status==='platform'&&t.boarding<t.dwell)return `${t.id} is boarding at ${districtName(t.district)}. Ready in ${t.dwell-t.boarding} seconds.`;
 if(s.preview){const check=checkNetworkRoute(s,s.preview);return check.message;}
 return t.status==='waiting'?`${t.id}: choose a clear receiving track at ${districtName(t.district)} on the diagram.`:t.stops===1?`${t.id}: preview a path to ${districtName(otherDistrict(t.district))}. Both ends’ points must match before confirmation.`:`${t.id}: preview its departure from ${districtName(t.district)}.`;
}
export function validateNetworkState(s){
 const errors=[];
 if(s?.version!==NETWORK_VERSION||s?.networkId!==NETWORK.id||s?.contentRevision!==NETWORK.revision)return ['Incompatible network save'];
 const canonical=createNetworkState();
 if(!Number.isInteger(s.time)||s.time<0||s.time>1000000||typeof s.paused!=='boolean'||typeof s.complete!=='boolean'||!DISTRICTS.some(d=>d.id===s.view))errors.push('Invalid clock or view');
 if(!['guided','independent'].includes(s.assistance)||!['steady','brisk'].includes(s.pace))errors.push('Invalid desk settings');
 if(!Array.isArray(s.trains)||s.trains.length!==roster.length||new Set(s.trains.map(t=>t.id)).size!==roster.length||!s.trains.every(t=>roster.some(r=>r.id===t.id)))return [...errors,'Invalid train roster'];
 if(!s.trains.some(t=>t.id===s.selected))errors.push('Unknown selected train');
 if(!Array.isArray(s.routes)||new Set(s.routes.map(r=>r.trainId)).size!==s.routes.length||new Set(s.routes.map(r=>r.id)).size!==s.routes.length)return [...errors,'Duplicate or missing route'];
 if(!s.reservations||!s.points||!s.occupancy||!s.detection||!s.work||!Array.isArray(s.events)||!Array.isArray(s.journal))return [...errors,'Missing network state'];
 for(const id of Object.keys(canonical.points)){
  const p=s.points[id];if(!p||![1,2].includes(p.position)||![1,2].includes(p.proved)||(p.owner!==null&&typeof p.owner!=='string'))errors.push('Invalid points');
 }
 if(Object.keys(s.points).length!==Object.keys(canonical.points).length)errors.push('Unknown points');
 for(const id of Object.keys(canonical.detection))if(!['clear','unknown'].includes(s.detection[id]))errors.push('Invalid detection');
 if(Object.keys(s.detection).length!==Object.keys(canonical.detection).length)errors.push('Unknown detector');
 for(const key of ['active','ready','released'])if(typeof s.work[key]!=='boolean')errors.push('Invalid protection');
 if(s.work.active===s.work.released||s.work.released&&!s.work.ready)errors.push('Inconsistent protection');
 const claimed=new Set();
 for(const r of s.routes){
  const t=s.trains.find(t=>t.id===r.trainId);if(!t||!['proving','moving'].includes(t.status)){errors.push('Route/train disagree');continue;}
  if(!Array.isArray(r.resources)||!Array.isArray(r.points)||!['arrival','transfer','exit'].includes(r.kind)||!Number.isInteger(r.elapsed)||r.elapsed<0||r.elapsed>=r.duration){errors.push('Invalid route');continue;}
  const before={...s,trains:s.trains.map(train=>train.id===t.id?{...train,status:r.kind==='arrival'?'waiting':'platform'}:train)};
  const expected=networkRoutePlan(before,t.id,r.targetTrack);
  if(expected.error||expected.signature!==r.signature||expected.kind!==r.kind||expected.duration!==r.duration||JSON.stringify(expected.resources)!==JSON.stringify(r.resources)||JSON.stringify(expected.points)!==JSON.stringify(r.points)||expected.from!==r.from||expected.to!==r.to)errors.push('Route differs from authored path');
  for(const id of r.resources){if(claimed.has(id))errors.push('Resource claimed twice');claimed.add(id);if(s.reservations[id]!==r.id)errors.push(`Route lost ${id}`);}
  for(const p of r.points){const point=s.points[pointId(p.district,p.side)];if(point?.owner!==r.id||point.proved!==p.track)errors.push('Locked points changed');}
  if((r.elapsed<2&&r.state!=='proving')||(r.elapsed===2&&r.state!=='locked')||(r.elapsed>=3&&r.state!=='occupied'))errors.push('Invalid route proof state');
  if(s.work.active&&r.resources.includes(trackId('higashi',2)))errors.push('Route through protected track');
 }
 for(const [id,routeId] of Object.entries(s.reservations))if(!Object.hasOwn(canonical.detection,id)||!s.routes.some(r=>r.id===routeId&&r.resources.includes(id)))errors.push('Orphan reservation');
 for(const [id,p] of Object.entries(s.points))if(p.owner&&!s.routes.some(r=>r.id===p.owner&&r.points.some(point=>pointId(point.district,point.side)===id)))errors.push('Orphan point lock');
 for(const t of s.trains){
  const authored=roster.find(r=>r.id===t.id);
  if(!['scheduled','waiting','platform','proving','moving','done'].includes(t.status)||!Number.isInteger(t.boarding)||t.boarding<0||![0,1,2].includes(t.stops)||!DISTRICTS.some(d=>d.id===t.district)||!(t.track===null||[1,2].includes(t.track)))errors.push('Invalid train state');
  if(t.direction!==authored.direction||t.arrival!==authored.arrival||t.due!==authored.due||t.kind!==authored.kind||t.dwell!==(t.kind==='Freight'?5:8))errors.push('Train differs from authored roster');
  if(['moving','proving'].includes(t.status)&&!s.routes.some(r=>r.trainId===t.id))errors.push('Moving train without route');
  if(t.status==='platform'&&s.occupancy[trackId(t.district,t.track)]!==t.id)errors.push('Standing train lost occupancy');
  if(t.status==='done'&&(!Number.isInteger(t.departedAt)||t.stops!==2))errors.push('Invalid completed train');
 }
 for(const [id,trainId] of Object.entries(s.occupancy)){if(!Object.hasOwn(canonical.detection,id)||!s.trains.some(t=>t.id===trainId))errors.push('Unknown occupant');const owner=resourceOwner(s,id);if(owner&&owner.trainId!==trainId)errors.push('Conflicting occupancy and reservation');}
 if(s.occupancy[NETWORK.link]&&!s.routes.some(r=>r.kind==='transfer'&&r.trainId===s.occupancy[NETWORK.link]))errors.push('Link occupant has no transfer');
 if(!Number.isInteger(s.sequence)||s.sequence<0||!Number.isInteger(s.eventSequence)||s.eventSequence<0||!Number.isFinite(s.refusals)||!Number.isInteger(s.revision))errors.push('Invalid sequence');
 if(new Set(s.events.map(e=>e.id)).size!==s.events.length||!s.events.every(e=>typeof e.id==='string'&&Number.isInteger(e.time)&&typeof e.title==='string'&&typeof e.detail==='string'&&typeof e.important==='boolean'&&typeof e.acknowledged==='boolean'&&typeof e.resolved==='boolean'&&typeof e.pausedOnce==='boolean'&&DISTRICTS.some(d=>d.id===e.location)&&(e.trainId===null||s.trains.some(t=>t.id===e.trainId))))errors.push('Invalid event');
 if(!s.journal.every(e=>typeof e.id==='string'&&Number.isInteger(e.time)&&typeof e.text==='string'))errors.push('Invalid journal');
 if(s.preview){const p=s.preview,plan=networkRoutePlan(s,p.trainId,p.targetTrack);if(typeof p.id!=='string'||plan.error||p.signature!==plan.signature||JSON.stringify(p.resources)!==JSON.stringify(plan.resources)||JSON.stringify(p.points)!==JSON.stringify(plan.points))errors.push('Invalid preview');}
 if(s.complete&&(!s.trains.every(t=>t.status==='done')||!s.work.released||!s.results||!Number.isFinite(s.results.score)||!Number.isFinite(s.results.delay)||!Number.isFinite(s.results.punctual)))errors.push('Invalid handover');
 return errors;
}
export function isValidNetworkSave(s){try{return !validateNetworkState(s).length;}catch{return false;}}
