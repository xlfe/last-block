/** Deterministic fictional railway. One tick is one railway second. */
export const VERSION = 1;
const service = (id, direction, arrival, due, kind='Local', dwell=8) => ({id,direction,arrival,due,kind,dwell});
export const SCENARIOS = [
 {id:'first-bells',title:'First bells',chapter:'01',subtitle:'Learn the rhythm of the desk',duration:180,description:'The early local is approaching from Kyoto. Bring it into Track 1, let passengers board, then send it onwards to Nara. Your mentor will guide the first movement.',lesson:'Set points → request route → wait for clearance → depart.',trains:[service('101','east',5,52)],feature:null},
 {id:'passing-places',title:'Passing places',chapter:'02',subtitle:'Two trains. One single line.',duration:230,description:'Two locals meet here. Receive one on each track, then cross their paths only when the station throat has cleared. The interlocking will refuse an unsafe request.',lesson:'Opposing trains can pass on separate station tracks.',trains:[service('103','east',4,55),service('202','west',11,62),service('105','east',68,119)],feature:null},
 {id:'the-work-gang',title:'The work gang',chapter:'03',subtitle:'A telephone call changes the plan',duration:300,description:'A work gang is inspecting Track 2. The track stays protected until the foreman reports clear and you release the protection. A freight service can wait; passenger trains earn more punctuality points.',lesson:'Reading a call does not remove protection.',trains:[service('107','east',4,55),service('204','west',10,65),service('F31','east',57,121,'Freight',5),service('206','west',83,142)],feature:'work'},
 {id:'reserve-power',title:'Reserve power',chapter:'04',subtitle:'Keep a cool head when the lamps change',duration:350,description:'A supply interruption is expected this morning. If the normal supply fails, start the generator, wait until standby power is proved, then transfer the load. Existing locked routes remain protected.',lesson:'Starting, proving and transferring power are three different states.',trains:[service('109','east',4,54),service('208','west',13,70),service('F33','east',62,120,'Freight',5),service('210','west',81,143),service('111','east',125,187)],feature:'power'}
];
export function createState(scenario=0,difficulty='guided') {
 if(!Number.isInteger(scenario)||!SCENARIOS[scenario])scenario=0;
 if(!['guided','dispatcher'].includes(difficulty))difficulty='guided';
 const spec=SCENARIOS[scenario] || SCENARIOS[0];
 return {version:VERSION,scenario,difficulty,time:0,paused:true,complete:false,selected:spec.trains[0].id,points:{west:1,east:1},routes:[],trains:spec.trains.map(t=>({...t,status:'scheduled',track:null,phase:0,departedAt:null})),work:{active:spec.feature==='work',ready:false,released:false},power:{source:'normal',generator:'off',timer:0,failed:false},calls:[],log:[{time:0,text:'Desk opened. All signals at stop.',type:'info'}],feedback:'Read your shift brief, then take the desk.',refusals:0,handledCalls:0,score:null,results:null};
}
function record(s,text,type='info') {s.feedback=text;s.log.unshift({time:s.time,text,type});s.log=s.log.slice(0,40);}
export function throatFor(t,phase) {return phase==='arrival' ? (t.direction==='east'?'west':'east') : (t.direction==='east'?'east':'west');}
export function trackOccupied(s,track) {return s.trains.some(t=>t.track===track && ['arriving','platform','departing'].includes(t.status));}
export function lockAt(s,side) {return s.routes.find(r=>r.side===side);}
export function availableTrain(s) {return s.trains.find(t=>t.id===s.selected);}
function refuse(s,text) {s.refusals++;record(s,text,'refused');return {ok:false,message:text};}
export function command(s,action,payload={}) {
 if(action==='pause') {s.paused=!s.paused;return {ok:true};}
 if(action==='select') {if(s.trains.some(t=>t.id===payload.id))s.selected=payload.id;return {ok:true};}
 if(s.complete) return {ok:false,message:'Shift finished. Open the debrief.'};
 if(action==='point') {
  const side=payload.side;if(!['west','east'].includes(side)||![1,2].includes(payload.track))return refuse(s,'Choose Track 1 or Track 2.');
  if(lockAt(s,side))return refuse(s,`${side==='west'?'Kyoto':'Nara'} points locked: wait for the train’s tail to clear.`);
  if(s.power.source==='none')return refuse(s,'No control supply. Restore power before moving points.');
  s.points[side]=payload.track;record(s,`${side==='west'?'Kyoto':'Nara'} points set for Track ${payload.track}.`);return {ok:true};
 }
 if(action==='route') {
  const t=availableTrain(s);if(!t)return refuse(s,'Select a train on the timetable.');
  if(!['waiting','platform'].includes(t.status))return refuse(s,t.status==='scheduled'?`${t.id} has not reached the approach yet.`:`${t.id} is already moving or has left the district.`);
  if(s.power.source==='none')return refuse(s,'Supply failed. Start the generator, wait for proof, then transfer load.');
  const phase=t.status==='waiting'?'arrival':'departure';
  if(phase==='departure'&&t.phase<t.dwell)return refuse(s,`${t.id}: passengers boarding. Ready in ${Math.ceil(t.dwell-t.phase)} seconds.`);
  const side=throatFor(t,phase);const track=phase==='arrival'?payload.track:t.track;
  if(![1,2].includes(track))return refuse(s,'Choose an arrival track first.');
  if(s.work.active&&track===2)return refuse(s,'Track 2 protected for the work gang. Await their report and release protection.');
  if(s.points[side]!==track)return refuse(s,`Set ${side==='west'?'Kyoto':'Nara'} points to Track ${track} first.`);
  const conflict=lockAt(s,side);if(conflict)return refuse(s,`${side==='west'?'Kyoto':'Nara'} throat locked by ${conflict.train}. Wait for tail clearance.`);
  if(phase==='arrival'&&trackOccupied(s,track))return refuse(s,`Track ${track} occupied. Choose the other track or wait.`);
  if(phase==='departure'&&s.trains.some(o=>o.id!==t.id&&o.status==='departing'&&throatFor(o,'departure')===side))return refuse(s,'Exit section occupied. Wait for clearance.');
  s.routes.push({train:t.id,side,track,phase,state:'proving',elapsed:0});t.status=phase==='arrival'?'arriving':'departing';t.track=track;t.phase=0;
  record(s,`${t.id}: route requested. Proving ${side==='west'?'Kyoto':'Nara'} points and Track ${track}…`,'good');return {ok:true};
 }
 if(action==='call') {const call=s.calls.find(c=>!c.read);if(!call)return refuse(s,'No unanswered telephone calls.');call.read=true;s.handledCalls++;record(s,call.message,'call');return {ok:true};}
 if(action==='release') {if(!s.work.active)return refuse(s,'Track 2 has no active protection.');if(!s.work.ready)return refuse(s,'Keep protection applied. The foreman has not reported the track clear.');if(!s.calls.some(c=>c.id==='work-done'&&c.read))return refuse(s,'Answer the foreman’s completion call before releasing protection.');s.work.active=false;s.work.released=true;record(s,'Track 2 protection released. Both station tracks are available.','good');conclude(s);return {ok:true};}
 if(action==='generator') {if(s.power.generator!=='off')return refuse(s,'The generator has already been started.');s.power.generator='starting';s.power.timer=0;record(s,'Standby generator starting. Wait 10 seconds for supply proof.');return {ok:true};}
 if(action==='transfer') {if(s.power.generator!=='ready')return refuse(s,'Standby supply not proved. Wait until the generator reads READY.');s.power.source='standby';record(s,'Load transferred to proved standby supply. Desk control restored.','good');return {ok:true};}
 return {ok:false,message:'Unknown command.'};
}
function incoming(s,id,from,message) {s.calls.push({id,from,message,read:false});record(s,`Telephone: incoming call from ${from}.`,'call');}
export function step(s,seconds=1) {
 if(s.paused||s.complete)return s;
 for(let i=0;i<seconds;i++) {
  s.time++;
  for(const t of s.trains)if(t.status==='scheduled'&&t.arrival<=s.time){t.status='waiting';record(s,`${t.id} waiting at the ${t.direction==='east'?'Kyoto':'Nara'} approach.`);}
  if(s.scenario===2&&s.time===1)incoming(s,'work-start','Work foreman','Track 2 remains protected. Inspection under way. I will telephone when everyone and all tools are clear.');
  if(s.scenario===2&&s.time===48){s.work.ready=true;incoming(s,'work-done','Work foreman','Track 2 inspection complete. All people and tools clear. You may now release the protection.');}
  if(s.scenario===3&&s.time===27){s.power.failed=true;if(s.power.source!=='standby')s.power.source='none';incoming(s,'power-fault','Station electrician','Normal supply has failed. Start the standby generator. Wait for READY, then transfer the load. Acknowledging this call does not restore the supply.');}
  if(s.power.generator==='starting'){s.power.timer++;if(s.power.timer>=10){s.power.generator='ready';record(s,'Standby generator READY. Supply proved; transfer load to restore desk control.','good');}}
  for(const t of s.trains)if(t.status==='platform')t.phase++;
  const finished=[];
  for(const r of s.routes){
   r.elapsed++;const t=s.trains.find(t=>t.id===r.train);
   if(r.state==='proving'&&r.elapsed>=2){r.state='locked';record(s,`${t.id}: route proved and locked. Signal clear.`,'good');}
   if(r.elapsed>=3)r.state='occupied';
   if(r.elapsed>=14){
    if(r.phase==='arrival'){t.status='platform';t.phase=0;record(s,`${t.id} arrived Track ${t.track}. Tail clear; ${r.side==='west'?'Kyoto':'Nara'} points released.`,'good');}
    else{t.status='done';t.departedAt=s.time;t.phase=0;record(s,`${t.id} clear of the district. Route released.`,'good');}
    finished.push(r);
   }
  }
  s.routes=s.routes.filter(r=>!finished.includes(r));
  if(conclude(s))break;
 }
 return s;
}
function conclude(s) {
 if(!s.trains.every(t=>t.status==='done'))return false;
 if(s.scenario===2&&!s.work.released){if(!s.awaitingHandover){s.awaitingHandover=true;record(s,'All trains clear. Handover still needs the foreman’s completion call and safe release of Track 2.');}return false;}
 s.complete=true;s.paused=true;
 const delay=s.trains.reduce((n,t)=>n+Math.max(0,t.departedAt-t.due),0);
 const weighted=s.trains.reduce((n,t)=>n+Math.max(0,t.departedAt-t.due)*(t.kind==='Freight'?1:2),0);
 const punctual=s.trains.filter(t=>t.departedAt<=t.due).length;
 const base=Math.max(0,100-Math.round(weighted/(s.difficulty==='guided'?10:6)));
 s.score=Math.max(0,base-(s.difficulty==='guided'?0:Math.min(15,s.refusals)));
 s.results={delay,weighted,punctual,total:s.trains.length,calls:s.handledCalls,grade:s.score>=90?'Masterful':s.score>=70?'Steady hands':'Shift complete'};
 record(s,'All services clear. Your shift is complete.','good');return true;
}
export function hint(s) {
 if(s.complete)return 'All services are clear. Open your debrief to see the next shift.';
 if(s.power.source==='none')return s.power.generator==='off'?'Start the standby generator on the utilities panel.':s.power.generator==='starting'?'The generator is starting. Wait for READY, then transfer load.':'Standby supply is proved. Press Transfer load to restore the desk.';
 if(s.calls.some(c=>!c.read))return 'The telephone is ringing. Answer the call for an operational report.';
 if(s.work.active&&s.work.ready)return 'The foreman has reported clear. Release Track 2 protection on the utilities panel.';
 const t=availableTrain(s);
 if(!t)return 'Select a train on the paper timetable.';
 if(['arriving','departing'].includes(t.status))return `${t.id} is moving. The route stays locked until its tail clears. You can select another train.`;
 if(t.status==='scheduled')return `${t.id} is due at ${formatTime(t.arrival)}. Start or resume the clock and wait for the approach lamp.`;
 if(t.status==='done')return 'Select the next waiting train on the paper timetable.';
 if(t.status==='platform'&&t.phase<t.dwell)return `${t.id} is boarding. Wait ${Math.ceil(t.dwell-t.phase)} seconds, then set the exit points to Track ${t.track}.`;
 const phase=t.status==='waiting'?'arrival':'departure';const side=throatFor(t,phase);const free=[1,2].find(track=>!trackOccupied(s,track)&&!(track===2&&s.work.active));
 const track=phase==='departure'?t.track:free;
 if(lockAt(s,side))return `Wait for ${lockAt(s,side).train} to clear the ${side==='west'?'Kyoto':'Nara'} throat; its points are locked.`;
 if(!track)return 'Both tracks are occupied or protected. Depart a train to make room.';
 return `${t.id}: set ${side==='west'?'Kyoto':'Nara'} points to Track ${track}, then ${phase==='arrival'?`request arrival on Track ${track}`:'clear the departure signal'}.`;
}
export function formatTime(t) {return `07:${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;}
export function validateState(s) {
 const errors=[];
 if(new Set(s.routes.map(r=>r.train)).size!==s.routes.length)errors.push('Train owns duplicate routes');
 for(const side of ['west','east'])if(s.routes.filter(r=>r.side===side).length>1)errors.push(`Multiple routes own ${side} throat`);
 for(const track of [1,2])if(s.trains.filter(t=>t.track===track&&['arriving','platform','departing'].includes(t.status)).length>1)errors.push(`Multiple trains occupy Track ${track}`);
 for(const r of s.routes){const train=s.trains.find(t=>t.id===r.train);if(!train){errors.push('Route refers to unknown train');continue;}if(train.track!==r.track||train.status!==(r.phase==='arrival'?'arriving':'departing'))errors.push('Route and train disagree');if(s.points[r.side]!==r.track)errors.push('Locked route points changed');if(s.work.active&&r.track===2)errors.push('Route through protected track');if(r.elapsed<2&&r.state!=='proving')errors.push('Route authorised before proof');}
 for(const t of s.trains)if(['arriving','departing'].includes(t.status)&&!s.routes.some(r=>r.train===t.id))errors.push('Moving train has no route');
 return errors;
}
