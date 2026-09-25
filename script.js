function join(){alert("Welcome to eFootball Dreamers! Account creation is coming soon.");}function login(){alert("Login is coming soon.");}function eventInfo(name){alert(name+" details and registration are coming soon.");}function react(btn){const n=btn.textContent.match(/\d+/);btn.textContent="♥ "+(n?Number(n[0])+1:1);btn.disabled=true;}function newPost(){alert("Posting will be available when community accounts are connected.");}function toggleMenu(){document.getElementById("navLinks").classList.toggle("open");}


const firePlayers=[
{name:"MBAPPÉ",role:"THE SPEEDSTER",number:10,image:"https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbappe_France_v_Paraguay_4_July_2026-124.jpg",goals:3,assists:2,saves:0,blocks:1,tackles:5},
{name:"MESSI",role:"THE MAGICIAN",number:10,image:"https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_Messi_Argentina_v_Egypt_7_July_2026-112.jpg",goals:2,assists:3,saves:0,blocks:2,tackles:6},
{name:"RONALDO",role:"THE PHENOMENON",number:7,image:"https://commons.wikimedia.org/wiki/Special:FilePath/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-087.jpg",goals:2,assists:1,saves:0,blocks:3,tackles:4},
{name:"NEYMAR",role:"THE SHOWMAN",number:10,image:"https://commons.wikimedia.org/wiki/Special:FilePath/Neymar_Junior_Brazil_V_Morocco_13_June_2026-145.jpg",goals:1,assists:4,saves:0,blocks:2,tackles:8}
];
let fireIndex=0,matchSeconds=4044,homeScore=2,awayScore=1;
function fireScoreFor(p){return Math.min(99,70+p.goals*6+p.assists*3+p.saves*2+p.blocks*2+p.tackles);}
function matchClock(){matchSeconds=Math.min(5400,matchSeconds+1);const m=Math.floor(matchSeconds/60),s=matchSeconds%60;const el=document.getElementById("matchMinute");if(el)el.textContent=m+":"+String(s).padStart(2,"0");}
function renderFire(){
 const p=firePlayers[fireIndex],score=fireScoreFor(p),ranked=firePlayers.map((x,i)=>({x,i,s:fireScoreFor(x)})).sort((a,b)=>b.s-a.s);
 const img=document.getElementById("firePlayerImage");if(img){img.src=p.image;img.alt=p.name}
 const n=document.getElementById("firePlayerName");if(n)n.textContent=p.name;
 const r=document.getElementById("fireRole");if(r)r.textContent=p.role;
 const sc=document.getElementById("fireScore");if(sc)sc.textContent=score;
 const pos=document.getElementById("firePosition");if(pos)pos.textContent="#"+p.number;
 const reason=document.getElementById("fireReason");if(reason)reason.textContent=p.goals+" GOALS • "+p.assists+" ASSISTS • "+p.tackles+" TACKLES";
 const status=document.getElementById("fireStatus");if(status)status.textContent=p.name+" is leading";
 const stats=document.getElementById("fireStats");if(stats)stats.innerHTML='<div class="fire-stat"><b>'+p.goals+'</b><span>⚽ GOALS</span></div><div class="fire-stat"><b>'+p.assists+'</b><span>🎯 ASSISTS</span></div><div class="fire-stat"><b>'+p.saves+'</b><span>🧤 SAVES</span></div><div class="fire-stat"><b>'+p.blocks+'</b><span>🛡 BLOCKS</span></div><div class="fire-stat"><b>'+p.tackles+'</b><span>💪 TACKLES</span></div><div class="fire-stat"><b>'+score+'</b><span>🔥 FORM</span></div>';
 const board=document.getElementById("fireLeaderboard");if(board)board.innerHTML=ranked.map((v,pos)=>'<button type="button" class="fire-rank '+(v.i===fireIndex?'active':'')+'" onclick="selectFirePlayer('+v.i+')"><strong>'+v.s+'</strong><b>#'+(pos+1)+' '+v.x.name+'</b><small>'+v.x.goals+' G • '+v.x.saves+' S • '+v.x.blocks+' B • '+v.x.tackles+' T</small></button>').join("");
 const momentum=Math.max(35,Math.min(85,50+(score-85)*2));const hm=document.getElementById("homeMomentum"),am=document.getElementById("awayMomentum"),fill=document.getElementById("momentumFill");if(hm)hm.textContent=Math.round(momentum)+"%";if(am)am.textContent=Math.round(100-momentum)+"%";if(fill)fill.style.width=momentum+"%";const mt=document.getElementById("momentumText");if(mt)mt.textContent=momentum>=50?"DREAMERS FC":"RIVALS XI";const hs=document.getElementById("homeScore"),as=document.getElementById("awayScore");if(hs)hs.textContent=homeScore;if(as)as.textContent=awayScore;
}
function selectFirePlayer(i){fireIndex=i;renderFire()}
function nextFirePlayer(){fireIndex=(fireIndex+1)%firePlayers.length;renderFire()}
function fireEvent(type){
 const p=firePlayers[fireIndex];let eventText="";
 if(type==="goal"){p.goals++;homeScore++;eventText=p.name+" scores! ⚽ DREAMERS FC "+homeScore+" — "+awayScore;}
 if(type==="save"){p.saves++;eventText=p.name+" makes a huge save! 🧤";}
 if(type==="block"){p.blocks++;eventText=p.name+" makes the block! 🛡";}
 if(type==="tackle"){p.tackles++;eventText=p.name+" wins the tackle! 💪";}
 fireIndex=firePlayers.map((x,i)=>({i,s:fireScoreFor(x)})).sort((a,b)=>b.s-a.s)[0].i;renderFire();const ev=document.getElementById("matchEvent");if(ev)ev.textContent=eventText;
}
document.addEventListener("DOMContentLoaded",()=>{renderFire();setInterval(matchClock,1000);});


/* REAL MATCH RESULT DEMO — browser storage for step 1 */
function getSubmittedMatches(){try{return JSON.parse(localStorage.getItem("dreamersMatches")||"[]")}catch(e){return[]}}
function saveSubmittedMatches(list){localStorage.setItem("dreamersMatches",JSON.stringify(list))}
function submitMatch(e){
 e.preventDefault();
 const match={player:document.getElementById("playerName").value.trim(),opponent:document.getElementById("opponentName").value.trim(),yourScore:Number(document.getElementById("yourScore").value),opponentScore:Number(document.getElementById("opponentScore").value),goals:Number(document.getElementById("goals").value),assists:Number(document.getElementById("assists").value),tackles:Number(document.getElementById("tackles").value),saves:Number(document.getElementById("saves").value),date:new Date().toLocaleString()};
 const list=getSubmittedMatches();list.unshift(match);saveSubmittedMatches(list.slice(0,20));
 document.getElementById("matchSaved").textContent="✓ Match saved on this device. Next we’ll connect it to the Players on Fire system.";e.target.reset();document.getElementById("yourScore").value=2;document.getElementById("opponentScore").value=1;document.getElementById("goals").value=2;document.getElementById("assists").value=1;document.getElementById("tackles").value=5;document.getElementById("saves").value=0;renderSubmittedMatches();
}
function renderSubmittedMatches(){
 const box=document.getElementById("submittedMatches");if(!box)return;const list=getSubmittedMatches();
 box.innerHTML=list.length?list.map(m=>'<div class="submitted-match"><span><strong>'+escapeHtml(m.player)+'</strong> vs '+escapeHtml(m.opponent)+' <small>• '+escapeHtml(m.date)+'</small></span><b>'+m.yourScore+' — '+m.opponentScore+'</b><span>'+m.goals+' G • '+m.assists+' A • '+m.tackles+' T • '+m.saves+' S</span></div>').join(""):'<div class="submitted-match"><span>No submitted matches yet.</span></div>';
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
document.addEventListener("DOMContentLoaded",renderSubmittedMatches);
