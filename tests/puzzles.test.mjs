import assert from 'node:assert/strict';
import {createWorld,createPlayer,step,DT} from '../physics.js';
import {nearbyInteraction,interact,submitCaptcha,allProven} from '../puzzles.js';
import {saveCheckpoint,restoreCheckpoint} from '../context.js';
export function proveClaims(w,p){
 const walk=x=>{let guard=0;while(Math.abs(p.x-x)>1&&guard++<1500)step(w,p,DT,Math.sign(x-p.x));step(w,p);assert(Math.abs(p.x-x)<=1);};
 walk(120);assert(interact(w,p,nearbyInteraction(w,p)));walk(480);assert(interact(w,p,nearbyInteraction(w,p)));assert(w.claims.delivery);
 walk(650);assert(interact(w,p,nearbyInteraction(w,p)));walk(710);assert(interact(w,p,nearbyInteraction(w,p)));assert(!w.claims.contradiction);walk(780);assert(w.claims.contradiction);
 walk(1060);assert.equal(nearbyInteraction(w,p).kind,'captcha');assert(!submitCaptcha(w,['check']));assert(!w.claims.captcha);assert(submitCaptcha(w,['question','bang','bracket']));assert(allProven(w));walk(69);
}
const w=createWorld(),p=createPlayer();assert.equal(nearbyInteraction(w,p),null);proveClaims(w,p);
const saved=saveCheckpoint(w,p,.5);w.bugs[1].x=1000;w.claims.captcha=false;assert(restoreCheckpoint(saved).world.claims.captcha);assert(Math.abs(restoreCheckpoint(saved).world.bugs[1].x-710)<2);
const locked=createWorld(),atExit=createPlayer();atExit.x=160;atExit.y=134;atExit.ground='upper-12';step(locked,atExit);assert(!atExit.won,'Reaching exit without evidence does not win');locked.claims={delivery:true,contradiction:true,captcha:true};step(locked,atExit);assert(atExit.won);
console.log('PASS bug delivery, two-node contradiction, CAPTCHA, exit gating, saved evidence');
