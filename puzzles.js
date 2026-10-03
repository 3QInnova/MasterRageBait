export const INTERACT_COST=3;
export function addPuzzles(world){
 world.claims={delivery:false,contradiction:false,captcha:false};
 world.bugs=[{id:'question',symbol:'?',x:120,y:1436,carried:false,delivered:false},{id:'bracket',symbol:'}',x:650,y:1436,carried:false,delivered:false}];
 world.socket={x:480,y:1436};world.nodes=[{x:710,y:1436},{x:780,y:1436}];world.captcha={x:1060,y:1436};
}
export const allProven=w=>Object.values(w.claims).every(Boolean);
export function nearbyInteraction(w,p){
 if(!p.ground||Math.abs(p.y-1436)>25)return null;
 const near=x=>Math.abs(p.x-x)<45;
 const carried=w.bugs.find(b=>b.carried);
 if(near(w.captcha.x)&&!w.claims.captcha)return {kind:'captcha',label:'Challenge CAPTCHA · 3 tokens'};
 if(near(w.socket.x)&&!w.claims.delivery)return {kind:'socket',label:carried?'Deliver bug · 3 tokens':'Evidence socket: bring a bug',enabled:!!carried};
 const bug=w.bugs.find(b=>!b.carried&&!b.delivered&&near(b.x));
 if(carried)return {kind:'drop',label:'Put bug down · 3 tokens'};
 if(bug)return {kind:'pickup',id:bug.id,label:`Pick up ${bug.symbol} bug · 3 tokens`};
 return null;
}
export function interact(w,p,action){
 const carried=w.bugs.find(b=>b.carried);
 if(action.kind==='pickup'){const b=w.bugs.find(b=>b.id===action.id);if(!b||b.delivered||b.carried)return false;b.carried=true;}
 else if(action.kind==='drop'&&carried){carried.carried=false;carried.x=p.x;carried.y=p.y;}
 else if(action.kind==='socket'&&carried){carried.carried=false;carried.delivered=true;w.claims.delivery=true;}
 else return false;
 return true;
}
export function updatePuzzles(w,p){
 for(const b of w.bugs)if(b.carried){b.x=p.x;b.y=p.y-28;}
 const occupied=n=>p.ground&&Math.abs(p.x-n.x)<22&&Math.abs(p.y-n.y)<20||w.bugs.some(b=>!b.carried&&!b.delivered&&Math.abs(b.x-n.x)<22&&Math.abs(b.y-n.y)<20);
 if(w.nodes.every(occupied))w.claims.contradiction=true;
}
export function submitCaptcha(w,selected){const correct=['question','bang','bracket'];const valid=selected.length===3&&correct.every(id=>selected.includes(id));if(valid)w.claims.captcha=true;return valid;}
