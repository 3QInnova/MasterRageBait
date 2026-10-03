import {addPuzzles,allProven,updatePuzzles} from './puzzles.js';
export const W=1260,H=1500,DT=1/120,R=14,GRAVITY=760,MOVE_SPEED=150;
export const REQUESTS={safe:'Make jumping safer',exit:'Move the exit closer',clean:'Remove the obstacles'};
const lines={
 safe:[['Safety improved!','Added a cushion. You cannot be too safe.','cushion'],['More room for error.','I enlarged the landing. The ceiling is unrelated.','wide'],['Safety net installed.','A safety net. With excellent upward mobility.','net']],
 exit:[['Exit relocated.','The exit is closer. Accessibility solved.','near'],['Exit made portable.','It moves now. You are welcome.','moving'],['Shortcut delivered.','I added a shortcut. Please ignore the small print.','shortcut']],
 clean:[['Obstacles removed.','Removed the spikes and their unnecessary platform.','missing'],['Visual clutter removed.','The platform is still there. Mostly.','invisible'],['Performance improved.','I made the obstacles smaller. And faster.','sweeper']]
};
export function createWorld(request='safe',variant=0,event=0){
 const [label,line,kind]=lines[request][variant];
 const platforms=[{id:'start',x:12,y:450,w:1220},{id:'a',x:156,y:376,w:99},{id:'b',x:35,y:297,w:105},{id:'c',x:184,y:225,w:112},{id:'d',x:308,y:144,w:96}];
 const world={request,variant,event,label,line,kind,platforms,clock:0,eventTriggered:false,exit:{x:351,y:144},hazards:[]};
 if(kind==='cushion'){platforms[1].spring=true;world.hazards.push({x:154,y:82,w:105,h:12});}
 if(kind==='wide'){platforms[2].w=135;world.hazards.push({x:20,y:170,w:95,h:12});}
 if(kind==='net'){platforms.push({id:'net',x:274,y:414,w:125,spring:true});}
 if(kind==='near')world.exit={x:236,y:225};
 if(kind==='moving')world.exit={x:351,y:144,moving:true};
 if(kind==='shortcut'){platforms.push({id:'shortcut',x:280,y:305,w:110});world.hazards.push({x:324,y:281,w:28,h:10});}
 if(kind==='missing'){platforms[2].x=28;platforms[2].w=56;platforms.push({id:'replacement',x:83,y:281,w:56});}
 if(kind==='invisible')platforms[2].invisible=true;
 if(kind==='sweeper')world.hazards.push({x:130,y:330,w:30,h:12,moving:true});
 // Keep the original room as the bottom third; extend upward with two more climbs.
 for(const s of platforms)s.y+=1000;
 for(const h of world.hazards)h.y+=1000;
 world.exit.y+=1000;
 for(let i=0;i<13;i++)platforms.push({id:`upper-${i}`,x:i%2?235:100,y:1060-i*76,w:120});
 platforms.find(s=>s.id==='d').checkpoint=1;
 platforms.find(s=>s.id==='upper-6').checkpoint=2;
 platforms.find(s=>s.id==='upper-12').checkpoint=3;
 world.exit=kind==='near'?{x:295,y:224}:{x:160,y:148,moving:kind==='moving'};
 world.puzzleSolved=false;addPuzzles(world);
 return world;
}
export function createPlayer(){return {x:69,y:1450-R,vx:0,vy:0,ground:'start',dead:false,won:false,landings:0};}
export function platformX(p,t){return p.x+(p.shift?Math.sin(t*1.5)*14:0);}
export function hazardX(h,t){return h.x+(h.moving?Math.sin(t*2)*78:0);}
export function exitX(world){return world.exit.x+(world.exit.moving?Math.sin(world.clock*1.4)*27:0);}
export function launch(player,power,angle){if(!player.ground||player.vx!==0||player.dead||player.won)return false;const speed=250+Math.max(0,Math.min(1,power))*260;player.vx=Math.sin(angle)*speed;player.vy=-Math.cos(angle)*speed;player.ground=null;return true;}
export function step(world,p,dt=DT,move=0){
 if(p.dead||p.won)return;world.clock+=dt;
 if(p.ground){const platform=world.platforms.find(s=>s.id===p.ground);p.y=platform.y-R;const x=platformX(platform,world.clock);p.vx=Math.sign(move)*MOVE_SPEED;p.x+=p.vx*dt;
 if(p.x<x-R/2||p.x>x+platform.w+R/2){p.ground=null;p.vy=0;}}
 else{
 const previous=p.y;p.vy+=GRAVITY*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
 if(p.x<R){p.x=R;p.vx=Math.abs(p.vx)*.4;}if(p.x>W-R){p.x=W-R;p.vx=-Math.abs(p.vx)*.4;}
 if(p.vy>0){for(const s of world.platforms){const x=platformX(s,world.clock);if(previous+R<=s.y+.5&&p.y+R>=s.y&&p.x>=x-3&&p.x<=x+s.w+3){p.y=s.y-R;p.vx=0;p.vy=0;p.ground=s.id;p.landings++;
 if(s.spring&&p.x>x+15&&p.x<x+s.w-15){p.ground=null;p.vy=-480;p.vx=world.kind==='net'?-85:45;}
 break;}}}
 }
 for(const h of world.hazards){const x=hazardX(h,world.clock);if(p.x+R*.65>x&&p.x-R*.65<x+h.w&&p.y+R*.65>h.y&&p.y-R*.65<h.y+h.h)p.dead=true;}
 if(p.y>H+40)p.dead=true;
 if(!world.eventTriggered&&p.landings>=2){world.eventTriggered=true;if(world.event===1){const s=world.platforms.find(s=>s.id==='c');s.shift=true;}if(world.event===2)world.hazards.push({x:260,y:1262,w:28,h:12});}
 updatePuzzles(world,p);
 if(allProven(world)&&!p.dead&&p.ground&&Math.abs(p.x-exitX(world))<36&&Math.abs(p.y-(world.exit.y-R))<8)p.won=true;
}
