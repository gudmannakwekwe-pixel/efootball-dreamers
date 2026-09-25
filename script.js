function join(){alert("Welcome to eFootball Dreamers! Account creation is coming soon.");}function login(){alert("Login is coming soon.");}function eventInfo(name){alert(name+" details and registration are coming soon.");}function react(btn){const n=btn.textContent.match(/\d+/);btn.textContent="♥ "+(n?Number(n[0])+1:1);btn.disabled=true;}function newPost(){alert("Posting will be available when community accounts are connected.");}function toggleMenu(){document.getElementById("navLinks").classList.toggle("open");}


const firePlayers=[
{name:"MBAPPÉ",role:"THE SPEEDSTER",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbappe_France_v_Paraguay_4_July_2026-124.jpg",goals:3,assists:2,saves:0,blocks:1,tackles:5},
{name:"MESSI",role:"THE MAGICIAN",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_Messi_Argentina_v_Egypt_7_July_2026-112.jpg",goals:2,assists:3,saves:0,blocks:2,tackles:6},
{name:"RONALDO",role:"THE PHENOMENON",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-087.jpg",goals:2,assists:1,saves:0,blocks:3,tackles:4},
{name:"NEYMAR",role:"THE SHOWMAN",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Neymar_Junior_Brazil_V_Morocco_13_June_2026-145.jpg",goals:1,assists:4,saves:0,blocks:2,tackles:8}
];
let fireIndex=0;
function fireScoreFor(p){return Math.min(99,70+p.goals*6+p.assists*3+p.saves*2+p.blocks*2+p.tackles);}
function renderFire(){
 const p=firePlayers[fireIndex], score=fireScoreFor(p);
 const img=document.getElementById("firePlayerImage"); if(img){img.src=p.image;img.alt=p.name}
 const n=document.getElementById("firePlayerName"); if(n)n.textContent=p.name;
 const r=document.getElementById("fireRole"); if(r)r.textContent=p.role;
 const sc=document.getElementById("fireScore"); if(sc)sc.textContent=score;
 const reason=document.getElementById("fireReason"); if(reason)reason.textContent=p.goals+" GOALS • "+p.assists+" ASSISTS • "+p.tackles+" TACKLES";
 const status=document.getElementById("fireStatus"); if(status)status.textContent=p.name+" is leading";
 const stats=document.getElementById("fireStats");
 if(stats)stats.innerHTML='<div class="fire-stat"><b>'+p.goals+'</b><span>⚽ GOALS</span></div><div class="fire-stat"><b>'+p.assists+'</b><span>🎯 ASSISTS</span></div><div class="fire-stat"><b>'+p.saves+'</b><span>🧤 SAVES</span></div><div class="fire-stat"><b>'+p.blocks+'</b><span>🛡 BLOCKS</span></div><div class="fire-stat"><b>'+p.tackles+'</b><span>💪 TACKLES</span></div><div class="fire-stat"><b>'+score+'</b><span>🔥 FIRE RATING</span></div>';
 const board=document.getElementById("fireLeaderboard");
 if(board){
  const ranked=firePlayers.map((x,i)=>({x,i,s:fireScoreFor(x)})).sort((a,b)=>b.s-a.s);
  board.innerHTML=ranked.map((v,pos)=>'<button type="button" class="fire-rank '+(v.i===fireIndex?'active':'')+'" onclick="selectFirePlayer('+v.i+')"><strong>'+v.s+'</strong><b>#'+(pos+1)+' '+v.x.name+'</b><small>'+v.x.goals+' goals • '+v.x.tackles+' tackles</small></button>').join("");
 }
}
function selectFirePlayer(i){fireIndex=i;renderFire()}
function nextFirePlayer(){fireIndex=(fireIndex+1)%firePlayers.length;renderFire()}
function fireEvent(type){
 const p=firePlayers[fireIndex];
 if(type==="goal")p.goals++;
 if(type==="save")p.saves++;
 if(type==="block")p.blocks++;
 if(type==="tackle")p.tackles++;
 renderFire();
}
document.addEventListener("DOMContentLoaded",renderFire);
