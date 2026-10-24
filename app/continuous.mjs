/** Bounded deterministic traffic stream; operational authority remains in network.mjs. */
import {SERVICES} from './network-data.mjs';
export const CONTINUOUS_LIMIT=4;
export const CONTINUOUS_TEMPLATES=SERVICES.map(t=>({...t,templateId:t.id,budget:t.due-t.arrival+(t.kind==='Freight'?180:0),itinerary:t.id==='F71'?[...t.itinerary,'depot','higashi','boundary:nara']:t.id==='F82'?[...t.itinerary,'depot','kawara','mizuno','boundary:kyoto']:[...t.itinerary]}));
const nextRandom=c=>{let x=c.rng;x^=x<<13;x^=x>>>17;x^=x<<5;c.rng=x>>>0;return c.rng;};
export function initialiseContinuous(s,seed=42){const value=Number.isSafeInteger(seed)?seed>>>0:42;s.mode='continuous';s.trains=[];s.selected=null;s.continuous={version:1,seed:value||1,rng:value||1,nextId:1,nextAdmission:0,bag:[],summary:{points:0,completed:0,onTime:0,late:0,totalDelay:0,last:null}};advanceContinuous(s);return s;}
export function authoredContinuousTrain(t){const template=CONTINUOUS_TEMPLATES.find(x=>x.templateId===t.templateId);return template?{...template,id:t.id,arrival:t.admittedAt+5,due:t.admittedAt+5+template.budget}:null;}
export function advanceContinuous(s){if(s.mode!=='continuous')return;const c=s.continuous;
 for(const t of s.trains.filter(t=>t.status==='done')){const delay=Math.max(0,t.departedAt-t.due),points=Math.max(25,100-Math.floor(delay*(t.kind==='Freight'?1:2)/15));c.summary.points+=points;c.summary.completed++;c.summary[delay?'late':'onTime']++;c.summary.totalDelay+=delay;c.summary.last={id:t.id,points,delay,time:s.time};for(const e of s.events)if(e.trainId===t.id)e.resolved=true;}
 s.trains=s.trains.filter(t=>t.status!=='done');
 if(s.trains.length<CONTINUOUS_LIMIT&&(s.time>=c.nextAdmission||!s.trains.length)){
  if(!c.bag.length){c.bag=CONTINUOUS_TEMPLATES.map(t=>t.templateId);for(let i=c.bag.length-1;i>0;i--){const j=nextRandom(c)%(i+1);[c.bag[i],c.bag[j]]=[c.bag[j],c.bag[i]];}}
  const templateId=c.bag.shift(),template=CONTINUOUS_TEMPLATES.find(t=>t.templateId===templateId),id=`C${String(c.nextId++).padStart(5,'0')}`,arrival=s.time+5;
  s.trains.push({id,templateId:template.templateId,admittedAt:s.time,kind:template.kind,origin:template.origin,itinerary:[...template.itinerary],arrival,due:arrival+template.budget,nodeId:template.origin,leg:0,status:'scheduled',boarding:0,dwell:template.kind==='Freight'?5:6,departedAt:null});c.nextAdmission=s.time+45+nextRandom(c)%26;
 }
 if(!s.trains.some(t=>t.id===s.selected)){s.selected=s.trains[0].id;if(s.preview&&!s.trains.some(t=>t.id===s.preview.trainId))s.preview=null;}
 const recent=s.events.filter(e=>e.resolved).slice(-20);s.events=s.events.filter(e=>!e.resolved||recent.includes(e));
}
export function validateContinuous(s){const c=s.continuous,errors=[],integer=n=>Number.isSafeInteger(n)&&n>=0;
 if(!c||c.version!==1||!Number.isInteger(c.seed)||c.seed<1||c.seed>0xffffffff||!Number.isInteger(c.rng)||c.rng<1||c.rng>0xffffffff||!integer(c.nextId)||c.nextId<2||!integer(c.nextAdmission)||!Array.isArray(c.bag)||c.bag.length>7||new Set(c.bag).size!==c.bag.length||c.bag.some(id=>!CONTINUOUS_TEMPLATES.some(t=>t.templateId===id)))return ['Invalid continuous generator'];
 const a=c.summary;if(!a||!['points','completed','onTime','late','totalDelay'].every(k=>integer(a[k]))||a.onTime+a.late!==a.completed||a.points<a.completed*25||a.points>a.completed*100||s.complete||s.results!==null)errors.push('Invalid continuous score');
 if(a?.completed===0?a.last!==null:!a?.last||typeof a.last.id!=='string'||!integer(a.last.time)||!integer(a.last.delay)||!integer(a.last.points)||a.last.points<25||a.last.points>100)errors.push('Invalid last award');
 if(s.trains.length<1||s.trains.length>CONTINUOUS_LIMIT||s.events.length>CONTINUOUS_LIMIT*2+24||s.journal.length>150)errors.push('Unbounded continuous state');
 for(const t of s.trains)if(!/^C\d{5,}$/.test(t.id)||!integer(t.admittedAt)||t.admittedAt>s.time||Number(t.id.slice(1))>=c.nextId||t.status==='done')errors.push('Invalid generated service');return errors;
}
