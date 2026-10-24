/** Authored Web Audio effects, not recordings of the museum equipment. */
export const SOUND_KEY='last-block-sound-v1';
export function createDeskSound({contextFactory,storage,onStatus=()=>{}}={}) {
 let enabled=true,context=null,pending=null,status='ready',voices=new Set();
 try {enabled=(storage??globalThis.localStorage)?.getItem(SOUND_KEY)!=='off';}catch{}
 status=enabled?'ready':'muted';
 const emit=value=>{if(status!==value){status=value;onStatus(value);}};
 const stop=()=>{for(const voice of voices){try{voice.stop();}catch{}}voices.clear();};
 function persist(){try{(storage??globalThis.localStorage)?.setItem(SOUND_KEY,enabled?'on':'off');}catch{}}
 function unlock(){
  if(!enabled)return Promise.resolve(false);
  if(!context){
   try{
    const Factory=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!contextFactory&&!Factory){emit('unsupported');return Promise.resolve(false);}
    // Construction and resume both begin synchronously inside the click/tap handler.
    context=contextFactory?contextFactory():new Factory();
    context.addEventListener?.('statechange',()=>{if(enabled)emit(context.state==='running'?'running':'blocked');});
   }catch{emit('unsupported');return Promise.resolve(false);}
  }
  if(context.state==='running'){emit('running');return Promise.resolve(true);}
  if(pending)return pending;
  try{
   pending=Promise.resolve(context.resume()).then(()=>{const ready=context.state==='running';emit(ready?'running':'blocked');return ready;},()=>{emit('blocked');return false;}).finally(()=>{pending=null;});
   return pending;
  }catch{emit('blocked');return Promise.resolve(false);}
 }
 function note(frequency,offset,duration,gain=.07,wave='sine',end=frequency){
  const at=context.currentTime+offset,osc=context.createOscillator(),amp=context.createGain();
  osc.type=wave;osc.frequency.setValueAtTime(frequency,at);osc.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+duration);
  amp.gain.setValueAtTime(.0001,at);amp.gain.exponentialRampToValueAtTime(gain,at+.006);amp.gain.exponentialRampToValueAtTime(.0001,at+duration);
  osc.connect(amp);amp.connect(context.destination);voices.add(osc);
  osc.onended=()=>{voices.delete(osc);osc.disconnect();amp.disconnect();};osc.start(at);osc.stop(at+duration+.015);
 }
 function play(kind='relay'){
  if(!enabled||!context||context.state!=='running')return false;
  try{
   if(kind==='telephone')for(const offset of [0,.13,.26,.65,.78,.91]){note(620,offset,.09,.065,'sine');note(790,offset,.09,.035,'sine');}
   else if(kind==='bell'){note(880,0,.45,.09);note(1320,.02,.32,.035);}
   else if(kind==='confirm'){note(660,0,.2,.08);note(880,.16,.3,.075);}
   else if(kind==='refused'){note(180,0,.12,.06,'triangle',140);note(150,.15,.13,.045,'triangle',120);}
   else if(kind==='complete'){note(523,0,.28,.075);note(659,.2,.28,.07);note(784,.4,.5,.07);}
   else {note(1600,0,.035,.045,'triangle',220);note(850,.045,.025,.025,'triangle',180);}
   return true;
  }catch{emit('blocked');return false;}
 }
 return {
  get enabled(){return enabled;},get status(){return status;},
  unlock,
  gesture(kind='relay'){return unlock().then(ready=>ready&&play(kind));},
  play,
  setEnabled(value){enabled=Boolean(value);persist();if(!enabled){stop();emit('muted');return Promise.resolve(false);}emit('ready');return unlock().then(ready=>ready&&play('confirm'));}
 };
}
