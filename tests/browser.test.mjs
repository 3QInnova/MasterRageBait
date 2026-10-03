import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/private/tmp/edge-case-browser-check/node_modules/playwright/index.mjs');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{Math.random=()=>.01;});
await page.clock.install({time:new Date('2026-10-02T12:00:00Z')});
await page.clock.pauseAt(new Date('2026-10-02T12:00:01Z'));
const routes=JSON.parse(readFileSync(new URL('./completion-routes.json',import.meta.url)));
mkdirSync(new URL('../outputs/',import.meta.url),{recursive:true});
const state=()=>page.evaluate(async()=> (await import('/game.js')).snapshot());
async function walkTo(x){const s=await state();const key=x>s.player.x?'ArrowRight':'ArrowLeft';await page.keyboard.down(key);await page.clock.runFor(Math.abs(x-s.player.x)/150*1000);await page.keyboard.up(key);await page.clock.runFor(32);assert(Math.abs((await state()).player.x-x)<4,`Walk reaches ${x}`);}
async function use(){await page.locator('#interact').click();await page.clock.runFor(32);}

try{
 await page.goto('http://localhost:8000');await page.clock.runFor(80);
 await page.screenshot({path:new URL('../outputs/mobile-intro.png',import.meta.url).pathname,fullPage:true});
 await page.getByRole('button',{name:'Let’s break something',exact:true}).click();
 assert.equal((await state()).mode,'request');
 assert(await page.getByRole('button',{name:'Make jumping safer'}).isVisible());
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal overflow');
 await page.screenshot({path:new URL('../outputs/mobile-requests.png',import.meta.url).pathname,fullPage:true});
 for(let build=1;build<=3;build++){
  await page.getByRole('button',{name:'Make jumping safer'}).click();await page.clock.runFor(32);
  let s=await state();assert.equal(s.stage,build);assert.equal(s.mode,'play');
  if(build===1){
   const original={request:s.world.request,variant:s.world.variant,event:s.world.event};
   const walkStart=(await state()).player.x;
   await page.keyboard.down('ArrowRight');await page.clock.runFor(120);
   assert((await state()).player.x>walkStart+15,'Walking responds at fixed speed');
   await page.keyboard.down('Space');assert(!(await state()).charging,'Cannot charge while walking');await page.keyboard.up('Space');
   await page.keyboard.up('ArrowRight');const stopped=(await state()).player.x;assert.equal((await state()).player.vx,0,'Release immediately stops');await page.clock.runFor(100);assert.equal((await state()).player.x,stopped,'No drift after release');
   await page.keyboard.down('Space');await page.clock.runFor(180);assert((await state()).charging,'Keyboard charges after request selection');await page.locator('#launch-pad').dispatchEvent('pointerup',{pointerId:99});assert((await state()).charging,'Unrelated pointer cannot release keyboard charge');await page.keyboard.up('Space');assert.equal((await state()).player.ground,null,'Keyboard release launches');
   await page.getByRole('button',{name:/Return to checkpoint/}).click();await page.clock.runFor(16);s=await state();assert.deepEqual({request:s.world.request,variant:s.world.variant,event:s.world.event},original,'Replay preserves the build');
   await page.locator('#repair').click();assert((await state()).world.puzzleSolved);
   for(let i=0;i<60&&(await state()).mode==='play';i++){await page.keyboard.down('ArrowLeft');await page.keyboard.up('ArrowLeft');}
   assert.equal((await state()).mode,'compacted');assert.equal((await state()).tokens,0);assert.equal((await state()).world.puzzleSolved,false);assert(!(await state()).world.platforms.some(p=>p.id==='memory-bridge'));
   const frozen=(await state()).world.clock;await page.clock.runFor(500);assert.equal((await state()).world.clock,frozen);
   await page.getByRole('button',{name:'Resume from checkpoint',exact:true}).click();assert.equal((await state()).tokens,100);
   const cancelBox=await page.locator('#launch-pad').boundingBox();const cancelX=cancelBox.x+cancelBox.width/2,cancelY=cancelBox.y+30;await page.mouse.move(cancelX,cancelY);const savedAim=(await state()).aimAngle;await page.mouse.down();await page.mouse.move(cancelX+1,cancelY);assert(Math.abs((await state()).aimAngle-(savedAim+1/95))<.001,'Drag must preserve existing aim');await page.locator('#launch-pad').dispatchEvent('pointercancel',{pointerId:99});assert((await state()).charging,'Second pointer cannot cancel charge');await page.clock.runFor(180);await page.locator('#launch-pad').dispatchEvent('pointercancel',{pointerId:1});await page.mouse.up();assert.equal((await state()).player.ground,'start','Interrupted pointer must not launch');
   await page.mouse.down({button:'right'});assert(!(await state()).charging,'Right click cannot charge');await page.mouse.up({button:'right'});
   await page.mouse.down();await page.locator('#launch-pad').dispatchEvent('lostpointercapture',{pointerId:1});assert(!(await state()).charging,'Lost capture cancels safely');await page.mouse.up();assert.equal((await state()).player.ground,'start');
   await page.getByRole('button',{name:'Pause game'}).click();s=await state();assert.equal(s.mode,'paused');
   await page.clock.runFor(1000);assert.equal((await state()).world.clock,s.world.clock,'Pause freezes physics');
   await page.getByRole('button',{name:'Resume',exact:true}).click();await page.clock.runFor(16);
   await page.screenshot({path:new URL('../outputs/mobile-game.png',import.meta.url).pathname,fullPage:true});
  }
  await walkTo(120);await use();assert((await state()).world.bugs[0].carried);
  await walkTo(480);await use();assert((await state()).world.claims.delivery);assert.equal((await state()).checkpoint,.1);
  await walkTo(650);await use();await walkTo(710);await use();assert(!(await state()).world.claims.contradiction);
  await walkTo(780);assert((await state()).world.claims.contradiction);assert.equal((await state()).checkpoint,.2);
  await walkTo(1060);await use();assert.equal((await state()).mode,'captcha');
  for(const id of ['question','bang','bracket'])await page.locator(`[data-captcha="${id}"]`).click();
  await page.locator('#captcha-submit').click();await page.clock.runFor(32);assert((await state()).world.claims.captcha);
  await walkTo(69);assert.equal((await state()).checkpoint,.5);
  await page.locator('#zoom').click();await page.clock.runFor(32);assert((await state()).zoomed);await page.screenshot({path:new URL('../outputs/mobile-map.png',import.meta.url).pathname,fullPage:true});await page.locator('#zoom').click();await page.clock.runFor(32);assert(!(await state()).zoomed);
  s=await state();const route=routes.find(r=>r.request===s.world.request&&r.variant===s.world.variant&&r.event===s.world.event);
  for(const action of route.actions){
   if(action.wait)await page.clock.runFor(action.wait*1000);
   await page.locator('#launch-pad').scrollIntoViewIfNeeded();const bounds=await page.locator('#launch-pad').boundingBox();const x=bounds.x+bounds.width/2,y=bounds.y+bounds.height/2;
   const initialAngle=(await state()).aimAngle;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+95*(action.angle-initialAngle),y);
   await page.clock.runFor(action.power*900);await page.mouse.up();
   for(let i=0;i<200;i++){await page.clock.runFor(16);s=await state();if(s.mode!=='play'||s.player.ground)break;}
   assert(s.player.ground||s.mode!=='play','Jump must finish before another launch');
   assert.notEqual(s.mode,'dead',`Build ${build} UI route must survive`);
  }
  assert.equal((await state()).mode,build===3?'ready-to-ship':'complete',`Build ${build} must complete via controls: ${JSON.stringify((await state()).player)}`);
  if(build<3)await page.getByRole('button',{name:'Next build',exact:true}).click();
 }
 await page.getByRole('button',{name:'Ship it',exact:true}).click();assert.equal((await state()).mode,'won');
 await page.clock.runFor(80);await page.screenshot({path:new URL('../outputs/mobile-win.png',import.meta.url).pathname,fullPage:true});
 await page.reload();await page.clock.runFor(32);assert((await page.locator('#best').innerText()).includes('1 WIN'),'Best persists after reload');
 await page.setViewportSize({width:1280,height:1000});await page.screenshot({path:new URL('../outputs/desktop.png',import.meta.url).pathname,fullPage:true});
 assert.deepEqual(errors,[],'No browser runtime errors');
 const report={result:'pass',viewport:'390x844',checks:['bug pickup and delivery','contradiction requires both nodes','CAPTCHA evidence','zoom out map','exit requires three proofs','token exhaustion freezes and rolls back bridge', 'checkpoint refill', 'request selection','no horizontal overflow','keyboard charge and release','replay preserves build','pointer cancellation does not launch','secondary pointer cannot release or cancel','drag preserves aim','right click ignored','lost pointer capture cancels','pause freezes physics','three builds completed through pointer controls','final Ship win','local best survives reload','desktop render'],errors};
 writeFileSync(new URL('../outputs/browser-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
