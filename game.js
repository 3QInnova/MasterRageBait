import {W,H,R,DT,REQUESTS,createWorld,createPlayer,launch,step,platformX,hazardX,exitX} from './physics.js';
const $=s=>document.querySelector(s),canvas=$('#game'),ctx=canvas.getContext('2d');
let world=createWorld(),player=createPlayer(),mode='intro',stage=1,attempt=1,total=0,last=0,accumulator=0,hold=null,angle=.4,variantCounter=-1,toastTimer=0,winCount=0,particles=[],lastEvent=false;
let stats={wins:0,best:0};try{stats={...stats,...JSON.parse(localStorage.getItem('edge-case-v1')||'{}')};}catch{}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function save(){try{localStorage.setItem('edge-case-v1',JSON.stringify(stats));}catch{}}
function best(){ $('#best').textContent=stats.best?`BEST: ${stats.best.toFixed(1)}s · ${stats.wins} ${stats.wins===1?'WIN':'WINS'}`:'BEST: YOUR FIRST WIN AWAITS';}best();
function say(line){$('#dialogue').textContent=line;}
function toast(label){$('#patch-toast').textContent=label;$('#patch-toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#patch-toast').classList.remove('visible'),2500);}
function overlay(kicker,title,copy,actions){hold=null;$('#overlay-kicker').textContent=kicker;$('#overlay-title').innerHTML=title;$('#overlay-copy').textContent=copy;const box=$('#overlay-actions');box.replaceChildren();for(const [text,fn,secondary]of actions){const b=document.createElement('button');b.textContent=text;if(secondary)b.className='secondary';b.onclick=fn;box.append(b);}$('#overlay').hidden=false;}
function dismiss(){$('#overlay').hidden=true;}
function controls(requests){$('#requests').hidden=!requests;$('#launch-controls').hidden=requests;}
function ask(){mode='request';hold=null;dismiss();controls(true);say(stage===1?'What should I improve? I promise nothing.':'That was the intended solution. Obviously. Next improvement?');}
function choose(request){variantCounter++;const variant=(variantCounter+Math.floor(Math.random()*3))%3;const event=Math.floor(Math.random()*3);world=createWorld(request,variant,event);player=createPlayer();mode='play';lastEvent=false;accumulator=0;angle=.4;controls(false);dismiss();say(world.line);toast(world.label);updateHUD();$('#launch-pad').focus({preventScroll:true});}
function replay(){attempt++;player=createPlayer();world=createWorld(world.request,world.variant,world.event);lastEvent=false;mode='play';hold=null;dismiss();controls(false);say('Same build. This time, try being correct.');updateHUD();$('#launch-pad').focus({preventScroll:true});}
function reroll(){attempt++;player=createPlayer();world=createWorld();ask();updateHUD();}
function fresh(){stage=1;attempt=1;total=0;player=createPlayer();world=createWorld();ask();updateHUD();}
function updateHUD(){$('#build-label').textContent=`BUILD ${String(stage).padStart(3,'0')} / 003`;$ ('#attempt-label').textContent=`ATTEMPT ${attempt}`;$('#timer').textContent=`${Math.floor(total/60)}:${String(Math.floor(total%60)).padStart(2,'0')}`;}
function pause(){if(mode==='play'){mode='paused';hold=null;$('#pause').textContent='▶';$('#pause').setAttribute('aria-label','Resume game');overlay('NO NEW IMPROVEMENTS','Taking a breath?','Your build is frozen. Even PATCH has to wait.',[['Resume',resume]]);}else if(mode==='paused')resume();}
function resume(){mode='play';dismiss();$('#pause').textContent='Ⅱ';$('#pause').setAttribute('aria-label','Pause game');last=0;accumulator=0;$('#launch-pad').focus({preventScroll:true});}
$('#pause').onclick=pause;
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')pause();});
window.addEventListener('blur',()=>{if(mode==='play')pause();});
document.querySelectorAll('[data-request]').forEach(b=>b.onclick=()=>{if(mode==='request')choose(b.dataset.request);});
$('#retry').onclick=()=>{if(mode==='play')replay();};$('#new-fix').onclick=()=>{if(mode==='play')reroll();};
const pad=$('#launch-pad');
function begin(x,id){if(mode!=='play'||!player.ground||hold)return;hold={time:performance.now(),startX:x,id};}
function release(){if(!hold)return;const power=Math.min(1,(performance.now()-hold.time)/900);hold=null;if(mode==='play')launch(player,power,angle);}
pad.addEventListener('pointerdown',e=>{e.preventDefault();pad.setPointerCapture(e.pointerId);begin(e.clientX,e.pointerId);});
pad.addEventListener('pointermove',e=>{if(hold&&hold.id===e.pointerId)angle=Math.max(-1.02,Math.min(1.02,(e.clientX-hold.startX)/95+.4));});
pad.addEventListener('pointerup',release);pad.addEventListener('pointercancel',()=>{hold=null;});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target.tagName==='BUTTON'&&e.target!==pad)return;if(['Space','ArrowLeft','ArrowRight'].includes(e.code)&&!['INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();if(e.code==='Space')begin(0,'keyboard');if(e.code==='ArrowLeft')angle=Math.max(-1.02,angle-.1);if(e.code==='ArrowRight')angle=Math.min(1.02,angle+.1);}if(e.code==='Escape')pause();});
document.addEventListener('keyup',e=>{if(e.code==='Space'&&hold?.id==='keyboard')release();});
function die(){mode='dead';hold=null;say(['The issue appears to be your jumping.','I cannot reproduce this on my machine.','All tests passed. You were not in the tests.'][attempt%3]);overlay('REGRESSION DETECTED','Unexpected<br>outcome.',`Build ${stage} · ${REQUESTS[world.request]} · ${world.label}`,[['Replay this build',replay],['Ask for another fix',reroll,true]]);}
function complete(){mode='complete';hold=null;say('Excellent. You found the solution I definitely intended.');if(stage<3)overlay('YOU PROVED PATCH WRONG',`Build ${stage}<br>survived.`, 'One working build. Two more before we can ship.',[['Next build',()=>{stage++;player=createPlayer();world=createWorld();ask();updateHUD();}]]);else{mode='ready-to-ship';overlay('THREE BUILDS. ONE EDGE CASE.','It actually<br>works.', 'You made it. Ship this version before PATCH touches it.',[['Ship it',ship]]);}}
function ship(){mode='won';stats.wins++;stats.best=stats.best?Math.min(stats.best,total):total;save();best();say('As you can see, my assistance was essential.');overlay('PROJECT SHIPPED','You were<br>right.',`${total.toFixed(1)} seconds · ${attempt} ${attempt===1?'attempt':'attempts'} · PATCH takes full credit.`,[['Prove it again',fresh]]);winCount=1;}
function rr(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
function text(s,x,y,size=11,color='#a99abc',align='left'){ctx.font=`${size}px "Space Grotesk",system-ui`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(s,x,y);}
function draw(){
 ctx.clearRect(0,0,W,H);const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#222642');bg.addColorStop(1,'#151a2a');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='#9b8ccc12';ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<W;x+=24){ctx.moveTo(x,0);ctx.lineTo(x,H);}for(let y=0;y<H;y+=24){ctx.moveTo(0,y);ctx.lineTo(W,y);}ctx.stroke();
 text('TEST CHAMBER',22,67,11,'#827d9f');text('(still improving)',22,83,9,'#77718e');
 ctx.save();ctx.setLineDash([5,6]);ctx.strokeStyle='#756799';ctx.strokeRect(290,60,88,47);ctx.restore();text('TODO: polish',294,81,9,'#756799');
 text('GOOD IDEAS',26,175,10,'#9285a9');text('SOMETIMES',26,191,10,'#9285a9');text('GO TOO FAR.',26,207,10,'#9285a9');
 for(const s of world.platforms){const x=platformX(s,world.clock);ctx.save();if(s.invisible)ctx.globalAlpha=.25;rr(x,s.y+2,s.w,20,5,'#345767','#507684');rr(x,s.y-4,s.w,11,4,'#f4e2bd','#fff0d4');ctx.fillStyle='#596c7a';ctx.beginPath();ctx.arc(x+10,s.y+14,2,0,Math.PI*2);ctx.fill();ctx.save();ctx.setLineDash([4,5]);ctx.strokeStyle='#70648a';ctx.strokeRect(x+s.w+4,s.y-4,17,25);ctx.restore();if(s.shift)text('optimized ↔',x,s.y+38,9,'#ffb17d');if(s.id==='start')text('START · v0.1',x+12,s.y+39,10,'#b5acc0');if(s.spring){rr(x+18,s.y-28,s.w-36,20,8,'#fa8b88','#ffd0ae');ctx.strokeStyle='#fff0d4';ctx.beginPath();ctx.moveTo(x+s.w/2-7,s.y-9);ctx.lineTo(x+s.w/2+7,s.y-6);ctx.stroke();text('⌣',x+s.w/2,s.y-16,16,'#713345','center');text('safety improved',x+5,s.y-39,9,'#ffaf92');}ctx.restore();}
 for(const h of world.hazards){const x=hazardX(h,world.clock);rr(x,h.y,h.w,h.h,2,'#773648');ctx.fillStyle='#ffa387';for(let k=0;k<h.w;k+=12){ctx.beginPath();ctx.moveTo(x+k,h.y+h.h);ctx.lineTo(x+k+6,h.y+h.h+8);ctx.lineTo(x+k+12,h.y+h.h);ctx.fill();}}
 const ex=exitX(world);ctx.shadowColor='#79e8d2';ctx.shadowBlur=15;rr(ex-17,world.exit.y-55,34,52,5,'#427e7d','#79e8d2');ctx.shadowBlur=0;rr(ex-11,world.exit.y-49,22,40,3,'#72d5c1');text('EXIT',ex,world.exit.y-64,11,'#99f5df','center');text('⌣',ex,world.exit.y-26,18,'#1c4b53','center');
 if(mode==='play'&&player.ground){const power=hold?Math.min(1,(performance.now()-hold.time)/900):.4;const speed=250+power*260;ctx.save();ctx.setLineDash([3,6]);ctx.strokeStyle=hold?'#8bf5d6':'#afa4cb77';ctx.lineWidth=2;ctx.beginPath();for(let t=0;t<.45;t+=.04){const x=player.x+Math.sin(angle)*speed*t,y=player.y-Math.cos(angle)*speed*t+380*t*t;ctx.lineTo(x,y);}ctx.stroke();ctx.restore();}
 drawCharacter(player.x,player.y,mode==='won'||mode==='complete'||mode==='ready-to-ship');
 for(const p of particles){p.x+=p.vx*.016;p.y+=p.vy*.016;p.life-=.016;ctx.globalAlpha=Math.max(0,p.life);rr(p.x,p.y,4,4,1,p.color);}ctx.globalAlpha=1;particles=particles.filter(p=>p.life>0);
 if(winCount&&!reduced){for(let i=0;i<40;i++)particles.push({x:210,y:180,vx:(Math.random()-.5)*230,vy:(Math.random()-.5)*220,life:1+Math.random(),color:['#79e8d2','#ffd56c','#c2a6ff'][i%3]});winCount=0;}
}
function drawCharacter(x,y,happy){
 ctx.save();ctx.translate(x,y);const airborne=!player.ground&&!player.dead;if(!reduced)ctx.rotate(airborne?Math.sin(world.clock*8)*.12:0);const separation=airborne?3:0;
 ctx.fillStyle='#211d39';ctx.beginPath();ctx.ellipse(-7,16+separation,6,4,0,0,Math.PI*2);ctx.ellipse(8,16+separation,6,4,0,0,Math.PI*2);ctx.fill();rr(-12,16+separation,10,3,2,'#ffd761');rr(3,16+separation,10,3,2,'#ffd761');
 ctx.strokeStyle='#26213f';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-14,3);ctx.lineTo(-19,happy?-8:9);ctx.moveTo(14,3);ctx.lineTo(19,happy?-10:9);ctx.stroke();
 ctx.beginPath();ctx.moveTo(-15,-8);ctx.lineTo(-5,-18);ctx.lineTo(7,-17);ctx.lineTo(7,-10);ctx.lineTo(15,-8);ctx.lineTo(18,7);ctx.lineTo(4,16);ctx.lineTo(-12,12);ctx.closePath();ctx.fillStyle='#ffe9c8';ctx.fill();ctx.strokeStyle='#caba9f';ctx.lineWidth=1.5;ctx.stroke();
 ctx.beginPath();ctx.moveTo(-10,-5);ctx.lineTo(-3,-12);ctx.lineTo(5,-10);ctx.lineTo(12,-5);ctx.lineTo(12,6);ctx.lineTo(3,11);ctx.lineTo(-8,7);ctx.closePath();ctx.fillStyle='#2c2544';ctx.fill();
 ctx.beginPath();ctx.moveTo(-8,-4);ctx.lineTo(-2,-9);ctx.lineTo(4,-7);ctx.lineTo(9,-3);ctx.lineTo(9,5);ctx.lineTo(2,8);ctx.lineTo(-6,5);ctx.closePath();ctx.fillStyle='#ffda61';ctx.fill();
 ctx.fillStyle='#29213e';ctx.beginPath();ctx.ellipse(-3,-1,1.6,3,0,0,Math.PI*2);ctx.ellipse(5,-1,1.6,happy?1:3,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#29213e';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(1,2,3,.2,Math.PI-.2);ctx.stroke();
 ctx.save();ctx.translate(18+separation,-20+Math.sin(world.clock*4)*2);ctx.rotate(.3);rr(-4,-4,8,8,2,'#79e8d2','#b9ffee');ctx.restore();ctx.restore();
}
function frame(now){const delta=last?Math.min(.05,(now-last)/1000):0;last=now;if(mode==='play'){total+=delta;accumulator+=delta;while(accumulator>=DT&&mode==='play'){step(world,player);accumulator-=DT;if(world.eventTriggered&&!lastEvent){lastEvent=true;if(world.event){say(world.event===1?'I also optimized that platform. Small change.':'I added a regression test. Watch your head.');toast('Unrequested improvement deployed');}}if(player.dead)die();else if(player.won)complete();}}const power=hold?Math.min(1,(performance.now()-hold.time)/900):0;$('#charge-bar').style.width=`${power*100}%`;$('#power-label').textContent=mode==='play'?(player.ground?(hold?`${Math.round(power*100)}% POWER`:'READY'):'IN FLIGHT'):'BUILD FROZEN';updateHUD();draw();requestAnimationFrame(frame);}
overlay('UNEXPECTED INPUT','You are the<br>edge case.','Reach the exit. Prove the AI wrong. Hold the launch pad, drag to aim, release to jump.',[['Let’s break something',ask]]);controls(true);requestAnimationFrame(frame);

// Read-only snapshot used by local browser checks. No ability to bypass gameplay.
export function snapshot(){return {mode,stage,attempt,total,world:structuredClone(world),player:structuredClone(player),charging:!!hold};}
