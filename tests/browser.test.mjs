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
   await page.keyboard.press('ArrowRight');await page.keyboard.down('Space');await page.clock.runFor(180);assert((await state()).charging,'Keyboard charges after request selection');await page.keyboard.up('Space');assert.equal((await state()).player.ground,null,'Keyboard release launches');
   await page.getByRole('button',{name:/Replay this build/}).click();await page.clock.runFor(16);s=await state();assert.deepEqual({request:s.world.request,variant:s.world.variant,event:s.world.event},original,'Replay preserves the build');
   const cancelBox=await page.locator('#launch-pad').boundingBox();await page.mouse.move(cancelBox.x+cancelBox.width/2,cancelBox.y+30);await page.mouse.down();await page.clock.runFor(180);await page.locator('#launch-pad').dispatchEvent('pointercancel');await page.mouse.up();assert.equal((await state()).player.ground,'start','Interrupted pointer must not launch');
   await page.getByRole('button',{name:'Pause game'}).click();s=await state();assert.equal(s.mode,'paused');
   await page.clock.runFor(1000);assert.equal((await state()).world.clock,s.world.clock,'Pause freezes physics');
   await page.getByRole('button',{name:'Resume',exact:true}).click();await page.clock.runFor(16);
   await page.screenshot({path:new URL('../outputs/mobile-game.png',import.meta.url).pathname,fullPage:true});
  }
  s=await state();const route=routes.find(r=>r.request===s.world.request&&r.variant===s.world.variant&&r.event===s.world.event);
  for(const action of route.actions){
   if(action.wait)await page.clock.runFor(action.wait*1000);
   const bounds=await page.locator('#launch-pad').boundingBox();const x=bounds.x+bounds.width/2,y=bounds.y+bounds.height/2;
   await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+95*(action.angle-.4),y);
   await page.clock.runFor(action.power*900);await page.mouse.up();
   for(let i=0;i<200;i++){await page.clock.runFor(16);s=await state();if(s.mode!=='play'||s.player.ground)break;}
   assert(s.player.ground||s.mode!=='play','Jump must finish before another launch');
   assert.notEqual(s.mode,'dead',`Build ${build} UI route must survive`);
  }
  assert.equal((await state()).mode,build===3?'ready-to-ship':'complete',`Build ${build} must complete via controls`);
  if(build<3)await page.getByRole('button',{name:'Next build',exact:true}).click();
 }
 await page.getByRole('button',{name:'Ship it',exact:true}).click();assert.equal((await state()).mode,'won');
 await page.clock.runFor(80);await page.screenshot({path:new URL('../outputs/mobile-win.png',import.meta.url).pathname,fullPage:true});
 await page.reload();await page.clock.runFor(32);assert((await page.locator('#best').innerText()).includes('1 WIN'),'Best persists after reload');
 await page.setViewportSize({width:1280,height:1000});await page.screenshot({path:new URL('../outputs/desktop.png',import.meta.url).pathname,fullPage:true});
 assert.deepEqual(errors,[],'No browser runtime errors');
 const report={result:'pass',viewport:'390x844',checks:['request selection','no horizontal overflow','keyboard charge and release','replay preserves build','pointer cancellation does not launch','pause freezes physics','three builds completed through pointer controls','final Ship win','local best survives reload','desktop render'],errors};
 writeFileSync(new URL('../outputs/browser-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
