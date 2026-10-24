import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir,mkdir,copyFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=data=>createHash('sha256').update(data).digest('hex');

test('offline build pins the complete public app, remains deterministic and changes version with source',async()=>{
 const scratch=await mkdtemp(join(tmpdir(),'last-block-build-'));
 try{
  for(const dir of ['app','scripts','images','research'])await mkdir(join(scratch,dir));
  for(const name of await readdir(join(root,'app')))await copyFile(join(root,'app',name),join(scratch,'app',name));
  await copyFile(join(root,'scripts/build.py'),join(scratch,'scripts/build.py'));
  for(const name of ['PXL_20261023_062931472.jpg','PXL_20261023_063018289.jpg','PXL_20261023_062925354.jpg'])await copyFile(join(root,'images',name),join(scratch,'images',name));
  await writeFile(join(scratch,'research/private.txt'),'Never publish the companion dossier automatically.');
  const build=()=>execFileSync('python3',['scripts/build.py'],{cwd:scratch,stdio:'pipe'});
  build();const output=join(scratch,'dist'),manifest=JSON.parse(await readFile(join(output,'precache-manifest.json'),'utf8'));
  assert.match(manifest.version,/^[a-f0-9]{20}$/);
  const expected=['index.html','app.mjs','sim.mjs','sound.mjs','network.mjs','network-ui.mjs','network-data.mjs','network-paths.mjs','network-renderer.mjs','continuous.mjs','offline.mjs','styles.css','graph.css','workspace.css','assets/route-desk.jpg','assets/mimic-board.jpg','assets/power-desk.jpg'];
  assert.deepEqual(manifest.assets.map(a=>a.url).sort(),expected.sort());
  for(const asset of manifest.assets){assert.ok(resolve(output,asset.url).startsWith(output+'/'));assert.equal(hash(await readFile(join(output,asset.url))),asset.sha256,`${asset.url} must match its exact cached release`);}
  const worker=await readFile(join(output,'sw.js'),'utf8'),embedded=JSON.parse(worker.match(/^const ASSETS=(.+);$/m)[1]);
  assert.deepEqual(embedded.slice(0,-1),manifest.assets);
  assert.deepEqual(embedded.at(-1),{url:'precache-manifest.json',sha256:hash(await readFile(join(output,'precache-manifest.json')))});
  assert.ok(worker.includes(`const VERSION='${manifest.version}'`));
  assert.ok((await readFile(join(output,'index.html'),'utf8')).includes(`content="${manifest.version}"`));
  execFileSync(process.execPath,['--check',join(output,'sw.js')]);
  build();assert.equal(JSON.parse(await readFile(join(output,'precache-manifest.json'),'utf8')).version,manifest.version,'Same inputs produce the same offline release');
  await writeFile(join(scratch,'app/graph.css'),(await readFile(join(scratch,'app/graph.css'),'utf8'))+'\n/* A new authored release. */\n');
  build();assert.notEqual(JSON.parse(await readFile(join(output,'precache-manifest.json'),'utf8')).version,manifest.version,'Source changes must not reuse the old offline cache');
 }finally{await rm(scratch,{recursive:true,force:true});}
});
