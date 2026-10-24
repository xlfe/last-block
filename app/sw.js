/* Build replaces the version and exact output manifest. No private/source files are discovered at runtime. */
const VERSION='__CACHE_VERSION__';
const ASSETS=__ASSET_LIST__;
const BASE=new URL('./',self.registration.scope);
const PREFIX=`last-block-${encodeURIComponent(BASE.pathname)}-`;
const CACHE=PREFIX+VERSION;
const files=new Map(ASSETS.map(asset=>[new URL(asset.url,BASE).href,asset]));
const entry=new URL('index.html',BASE).href;
const digest=async buffer=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(n=>n.toString(16).padStart(2,'0')).join('');
async function verifiedResponse(url,asset){const response=await fetch(new Request(url,{cache:'no-store',credentials:'same-origin'}));if(!response.ok||new URL(response.url).origin!==BASE.origin)throw Error('Asset unavailable');const buffer=await response.arrayBuffer();if(await digest(buffer)!==asset.sha256)throw Error('Asset version mismatch');const headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.delete('Content-Length');return new Response(buffer,{status:response.status,statusText:response.statusText,headers});}
self.addEventListener('install',event=>{event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await Promise.all([...files].map(async([url,asset])=>cache.put(url,await verifiedResponse(url,asset))));}catch(error){await caches.delete(CACHE);throw error;}})());});
// Natural waiting/activation protects active games. No skipWaiting or clients.claim.
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==BASE.origin)return;const isEntry=event.request.mode==='navigate'&&(url.pathname===BASE.pathname||url.pathname===new URL(entry).pathname);const canonical=isEntry?entry:(url.search?'':url.href);if(!files.has(canonical))return;event.respondWith((async()=>{const cache=await caches.open(CACHE),stored=await cache.match(canonical);if(stored)return stored;try{const response=await verifiedResponse(canonical,files.get(canonical));await cache.put(canonical,response.clone());return response;}catch{return new Response('This game copy is incomplete. Reconnect and reopen the game to prepare offline use.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}})());});
self.addEventListener('message',event=>{if(event.data?.type!=='OFFLINE_STATUS'||!event.ports[0])return;event.waitUntil((async()=>{const cache=await caches.open(CACHE),present=await Promise.all([...files.keys()].map(url=>cache.match(url)));event.ports[0].postMessage({version:VERSION,complete:present.every(Boolean),assets:files.size});})());});
