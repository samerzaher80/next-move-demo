export const signals=[
 {id:'S-14',text:'Our checkout charged the same invoice twice. We need the duplicate reversed.',hours:3,impact:3},
 {id:'S-15',text:'The app freezes after the update. Six team members cannot finish orders.',hours:1,impact:5},
 {id:'S-16',text:'How can I export last month’s records for our accountant?',hours:14,impact:1},
 {id:'S-17',text:'The charger failed on my device; I want my money back.',hours:2,impact:2}
];
const lexicon={outage:[['freeze',3],['cannot',2],['failed',2],['down',3],['error',1]],billing:[['charged',3],['invoice',2],['duplicate',3],['money',1],['refund',2]],howto:[['how',3],['export',3],['help',2],['where',2]]};
const action={outage:'Open an incident triage task',billing:'Prepare a billing review task',howto:'Draft a help answer'};
export function infer(signal){const words=signal.text.toLowerCase();const scores=Object.fromEntries(Object.entries(lexicon).map(([k,features])=>[k,features.reduce((n,[word,w])=>n+(words.includes(word)?w:0),0)]));const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);const [intent,score]=ranked[0];const margin=score-ranked[1][1];const confidence=Math.min(.95,.45+.08*score+.05*margin);const uncertain=score<2||margin<2;return {intent,confidence,uncertain,action:uncertain?'Request human clarification':action[intent],scores,explanation:`${intent} score ${score}; next best ${ranked[1][0]} ${ranked[1][1]}. ${uncertain?'Low margin: human review required.':'Evidence supports a draft for review.'}`}}
export function prioritize(items){return [...items].sort((a,b)=>(b.impact*3-Math.min(b.hours,24)*.05)-(a.impact*3-Math.min(a.hours,24)*.05))}
export function createState(){return {remaining:prioritize(signals),reviewed:[],pending:null,feedback:[]}}
export function surface(state){const s=structuredClone(state);if(!s.pending&&s.remaining.length){const item=s.remaining[0];s.pending={item,proposal:infer(item),createdAutomatically:true}}return s}
export function decide(state,{approve,override}={}){const s=structuredClone(state);if(!s.pending)return s;const {item,proposal}=s.pending;const chosen=override||proposal.intent;const result=!approve?'Rejected; no action created':proposal.uncertain&&!override?'Local clarification request':`Local ${action[chosen]}`;s.reviewed.push({id:item.id,text:item.text,modelIntent:proposal.intent,chosenIntent:chosen,result});if(override)s.feedback.push({id:item.id,predicted:proposal.intent,corrected:override});s.remaining=s.remaining.filter(x=>x.id!==item.id);s.pending=null;return surface(s)}
