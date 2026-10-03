import assert from 'node:assert/strict';
import {createWorld,createPlayer,launch,step,DT,REQUESTS} from '../physics.js';
import {writeFileSync} from 'node:fs';

// Search actual fixed-step trajectories, including springs, moving hazards,
// and the unsolicited patch. Every winning path is replayed from scratch.
function route(request,variant,event){
 const initial={world:createWorld(request,variant,event),player:createPlayer(),actions:[]};
 const queue=[initial],seen=new Set();let explored=0;
 for(let i=0;i<queue.length&&explored<1300;i++){
  const state=queue[i];explored++;
  for(const wait of [0,.5])for(const power of [.15,.35,.55,.75,1])for(const angle of [-1,-.75,-.5,-.25,0,.25,.5,.75,1]){
   const w=structuredClone(state.world),p=structuredClone(state.player);
   for(let t=0;t<wait+power*.9;t+=DT)step(w,p);
   if(!launch(p,power,angle))continue;
   let frames=0;
   while(!p.dead&&!p.won&&!p.ground&&frames<600){step(w,p);frames++;}
   if(p.dead||frames>=600)continue;
   const actions=[...state.actions,{wait,power,angle}];
   if(p.won)return {actions,explored};
   if(actions.length>=8||!p.ground)continue;
   const key=`${p.ground}:${Math.round(p.x/12)}:${w.eventTriggered}:${Math.floor(w.clock%4)}`;
   if(!seen.has(key)){seen.add(key);queue.push({world:w,player:p,actions});}
  }
 }
 return null;
}
function replay(request,variant,event,actions){const w=createWorld(request,variant,event),p=createPlayer();for(const action of actions){for(let t=0;t<action.wait+action.power*.9;t+=DT)step(w,p);assert(launch(p,action.power,action.angle));let frames=0;while(!p.dead&&!p.won&&!p.ground&&frames<600){step(w,p);frames++;}assert(!p.dead);}assert(p.won);return {w,p};}
const evidence=[];
for(const request of Object.keys(REQUESTS))for(let variant=0;variant<3;variant++)for(let event=0;event<3;event++){
 const result=route(request,variant,event);assert(result,`No completion route: ${request}/${variant}/${event}`);
 const a=replay(request,variant,event,result.actions),b=replay(request,variant,event,result.actions);assert.deepEqual(a,b,'Same build must replay identically');
 evidence.push({request,variant,event,...result});console.log(`PASS ${request}/${variant}/${event}: ${result.actions.length} jumps`);
}
const w=createWorld(),p=createPlayer();assert(!p.won);const before=structuredClone(p);assert(launch(p,.5,.5));assert(!launch(p,.5,.5),'No double jump');p.dead=true;const dead=structuredClone(p);step(w,p);assert.deepEqual(p,dead,'Death cannot turn into a win');assert.equal(before.ground,'start');
writeFileSync(new URL('../tests/completion-routes.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
console.log('27/27 physical request/event combinations have replayed completion routes.');
