import {proveClaims} from './puzzles.test.mjs';
import assert from 'node:assert/strict';
import {createWorld,createPlayer,launch,step,DT,REQUESTS} from '../physics.js';
import {TOKEN_LIMIT,jumpCost,COSTS,saveCheckpoint,restoreCheckpoint,spend} from '../context.js';
import {writeFileSync} from 'node:fs';

// Search actual fixed-step trajectories, including springs, moving hazards,
// and the unsolicited patch. Every winning path is replayed from scratch.
function route(request,variant,event){
 const world=createWorld(request,variant,event),player=createPlayer();proveClaims(world,player);const initial={world,player,actions:[],tokens:TOKEN_LIMIT,checkpoint:.5};
 const queue=[initial],seen=new Set();let explored=0;
 while(queue.length&&explored<12000){
  queue.sort((a,b)=>b.player.y-a.player.y);
  const state=queue.pop();explored++;
  for(const wait of [0,.5])for(const power of [.15,.35,.55,.75,1])for(const angle of [-1,-.75,-.5,-.25,0,.25,.5,.75,1]){
   const w=structuredClone(state.world),p=structuredClone(state.player);let tokens=state.tokens-jumpCost(power),checkpoint=state.checkpoint;if(tokens<=0)continue;
   for(let t=0;t<wait+power*.9;t+=DT)step(w,p);
   if(!launch(p,power,angle))continue;
   let frames=0;
   while(!p.dead&&!p.won&&!p.ground&&frames<600){step(w,p);frames++;}
   if(p.dead||frames>=600)continue;
   const cp=w.platforms.find(s=>s.id===p.ground);if(cp?.checkpoint>checkpoint){checkpoint=cp.checkpoint;tokens=TOKEN_LIMIT;}
   const actions=[...state.actions,{wait,power,angle}];
   if(p.won)return {actions,explored};
   if(actions.length>=24||!p.ground)continue;
   const key=`${p.ground}:${Math.round(p.x/12)}:${w.eventTriggered}:${Math.floor(w.clock%4)}:${checkpoint}:${Math.floor(tokens/10)}`;
   if(!seen.has(key)){seen.add(key);queue.push({world:w,player:p,actions,tokens,checkpoint});}
  }
 }
 return null;
}
function replay(request,variant,event,actions){const w=createWorld(request,variant,event),p=createPlayer();proveClaims(w,p);let tokens=TOKEN_LIMIT,checkpoint=.5;for(const action of actions){tokens-=jumpCost(action.power);assert(tokens>0,'Completion route fits token budget');for(let t=0;t<action.wait+action.power*.9;t+=DT)step(w,p);assert(launch(p,action.power,action.angle));let frames=0;while(!p.dead&&!p.won&&!p.ground&&frames<600){step(w,p);frames++;}assert(!p.dead);const cp=w.platforms.find(s=>s.id===p.ground);if(cp?.checkpoint>checkpoint){checkpoint=cp.checkpoint;tokens=TOKEN_LIMIT;}}assert(p.won);return {w,p};}
const checkpointWorld=createWorld(),checkpointPlayer=createPlayer();
const saved=saveCheckpoint(checkpointWorld,checkpointPlayer);
checkpointWorld.puzzleSolved=true;checkpointWorld.platforms.push({id:'block',x:1,y:1,w:1});checkpointWorld.clock=20;checkpointPlayer.x=300;
const restored=restoreCheckpoint(saved);assert.equal(restored.world.puzzleSolved,false);assert(!restored.world.platforms.some(s=>s.id==='block'));assert.equal(restored.player.x,69);assert.equal(restored.tokens,TOKEN_LIMIT);assert.equal(restored.world.clock,0);
restored.world.platforms[0].x=900;assert.equal(saved.world.platforms[0].x,12,'Snapshot stays immutable across retries');
const solved=saveCheckpoint(checkpointWorld,checkpointPlayer,1);const solvedRestore=restoreCheckpoint(solved);assert(solvedRestore.world.puzzleSolved,'Solved state saved at checkpoint survives compaction');assert(solvedRestore.world.platforms.some(s=>s.id==='block'));
assert(spend(20,20).exhausted,'Exact limit immediately compacts');assert(spend(5,20).exhausted);assert(!spend(21,20).exhausted);
const evidence=[];
for(const request of Object.keys(REQUESTS))for(let variant=0;variant<3;variant++)for(let event=0;event<3;event++){
 const result=route(request,variant,event);assert(result,`No completion route: ${request}/${variant}/${event}`);
 const a=replay(request,variant,event,result.actions),b=replay(request,variant,event,result.actions);assert.deepEqual(a,b,'Same build must replay identically');
 evidence.push({request,variant,event,...result});console.log(`PASS ${request}/${variant}/${event}: ${result.actions.length} jumps`);
}
const w=createWorld(),p=createPlayer();assert(!p.won);const before=structuredClone(p);assert(launch(p,.5,.5));assert(!launch(p,.5,.5),'No double jump');p.dead=true;const dead=structuredClone(p);step(w,p);assert.deepEqual(p,dead,'Death cannot turn into a win');assert.equal(before.ground,'start');
writeFileSync(new URL('../tests/completion-routes.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
console.log('27/27 physical request/event combinations have replayed completion routes.');
