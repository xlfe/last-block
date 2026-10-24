import test from 'node:test';
import assert from 'node:assert/strict';
import {createDeskSound,SOUND_KEY} from '../app/sound.mjs';

function fixture(initial='on') {
  const values=new Map([[SOUND_KEY,initial]]),voices=[];
  const parameter=()=>({setValueAtTime(){},exponentialRampToValueAtTime(){}});
  const context={state:'suspended',currentTime:0,destination:{},resumeCount:0,
    async resume(){this.resumeCount++;this.state='running';},
    createOscillator(){const voice={frequency:parameter(),stops:[],connect(){},disconnect(){},start(){this.started=true;},stop(at){this.stops.push(at);}};voices.push(voice);return voice;},
    createGain(){return {gain:parameter(),connect(){},disconnect(){}};}
  };
  let constructions=0;
  const sound=createDeskSound({contextFactory:()=>{constructions++;return context;},storage:{getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)}});
  return {sound,context,values,voices,get constructions(){return constructions;}};
}

test('audio does not construct a context before a gesture, then recovers a suspended context',async()=>{
  const f=fixture();
  assert.equal(f.constructions,0);
  assert.equal(f.sound.play('bell'),false);
  assert.equal(await f.sound.gesture('bell'),true);
  assert.equal(f.constructions,1);
  assert.equal(f.sound.status,'running');
  f.context.state='suspended';
  assert.equal(f.sound.play('bell'),false);
  assert.equal(await f.sound.gesture('relay'),true);
  assert.equal(f.context.resumeCount,2);
  assert.equal(f.constructions,1);
});

test('saved mute prevents gesture output; enabling confirms, muting cancels scheduled voices',async()=>{
  const f=fixture('off');
  assert.equal(f.sound.enabled,false);
  assert.equal(await f.sound.gesture('telephone'),false);
  assert.equal(f.constructions,0);
  assert.equal(await f.sound.setEnabled(true),true);
  assert.equal(f.values.get(SOUND_KEY),'on');
  assert.ok(f.voices.some(v=>v.started));
  assert.equal(f.sound.play('telephone'),true);
  const scheduled=f.voices.length;
  await f.sound.setEnabled(false);
  assert.equal(f.values.get(SOUND_KEY),'off');
  assert.equal(f.sound.status,'muted');
  assert.ok(f.voices.every(v=>v.stops.at(-1)===undefined));
  assert.equal(f.sound.play('bell'),false);
  assert.equal(await f.sound.gesture('bell'),false);
  assert.equal(f.voices.length,scheduled);
});

test('a rejected resume reports blocked audio and a later gesture retries successfully',async()=>{
  const f=fixture();
  f.context.resume=async()=>{throw new Error('Browser blocked audio');};
  assert.equal(await f.sound.gesture('bell'),false);
  assert.equal(f.sound.status,'blocked');
  assert.equal(f.voices.length,0);
  f.context.resume=async()=>{f.context.state='running';};
  assert.equal(await f.sound.gesture('bell'),true);
  assert.equal(f.sound.status,'running');
  assert.equal(f.constructions,1);
});

test('unsupported audio or unavailable preference storage does not reject a gesture',async()=>{
  const sound=createDeskSound({contextFactory:()=>{throw new Error('No audio device');},storage:{getItem(){throw new Error('Storage blocked');},setItem(){throw new Error('Storage blocked');}}});
  assert.equal(await sound.gesture('bell'),false);
  assert.equal(sound.status,'unsupported');
  assert.equal(await sound.setEnabled(false),false);
  assert.equal(sound.enabled,false);
});
