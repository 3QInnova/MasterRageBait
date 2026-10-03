// Tunable prototype economy. No cost for idle time, menus, or aiming.
export const TOKEN_LIMIT=100;
export const COSTS={moveStart:2,moveSecond:4,build:{safe:12,exit:20,clean:16},repair:18};
export const jumpCost=power=>8+Math.ceil(Math.max(0,Math.min(1,power))*12-1e-6);
export function saveCheckpoint(world,player,id=0){return {id,world:structuredClone(world),player:{...structuredClone(player),vx:0,vy:0,dead:false,won:false}};}
export function restoreCheckpoint(checkpoint){return {world:structuredClone(checkpoint.world),player:structuredClone(checkpoint.player),tokens:TOKEN_LIMIT};}
export function spend(tokens,cost){return {tokens:Math.max(0,tokens-cost),exhausted:tokens<=cost};}
