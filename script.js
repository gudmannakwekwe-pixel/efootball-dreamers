/* eFootball Dreamers — Supabase connection settings */
const SUPABASE_URL="https://nvmcgiwdkdlfoethwetr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_nRxxHhlAcCweiDK1ZPxcaw_sP2AT8ko";
let dreamersSupabase=null;
async function getSupabase(){if(dreamersSupabase)return dreamersSupabase;const mod=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");dreamersSupabase=mod.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);return dreamersSupabase}
function accountStyles(){if(document.getElementById("dreamersAuthStyles"))return;const s=document.createElement("style");s.id="dreamersAuthStyles";s.textContent=`.auth-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px}.auth-modal.open{display:flex}.auth-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(8px)}.auth-card{position:relative;width:min(440px,100%);padding:30px;border:1px solid #17628e;border-radius:22px;background:linear-gradient(145deg,#081b2b,#03080d);box-shadow:0 30px 100px rgba(0,0,0,.75);color:#fff}.auth-card h2{margin:5px 0 8px;font-size:29px}.auth-sub{color:#8da7b9;font-size:12px;line-height:1.5;margin-bottom:20px}.auth-card label{display:block;color:#9ab0c0;font-size:10px;font-weight:800;letter-spacing:.7px;margin:13px 0}.auth-card input{display:block;box-sizing:border-box;width:100%;margin-top:7px;padding:13px 14px;border:1px solid #1b4058;border-radius:10px;background:#040c13;color:#fff;outline:none}.auth-card input:focus{border-color:#159fff;box-shadow:0 0 0 2px rgba(21,159,255,.13)}.auth-submit{width:100%;margin-top:8px}.auth-close{position:absolute;right:14px;top:8px;border:0;background:transparent;color:#7790a0;font-size:28px;cursor:pointer}.auth-switch{margin-top:16px;text-align:center;color:#71899a;font-size:10px}.auth-switch button{border:0;background:none;color:#42b9ff;cursor:pointer;font-weight:900}.auth-message{min-height:18px;margin:10px 0 0;color:#45c5ff;font-size:11px;font-weight:800}.auth-error{color:#ff7180}.auth-note{display:block;margin-top:14px;color:#60798b;font-size:9px;line-height:1.5}`;document.head.appendChild(s)}
function authModal(){accountStyles();let m=document.getElementById("dreamersAuthModal");if(m)return m;m=document.createElement("div");m.id="dreamersAuthModal";m.className="auth-modal";m.innerHTML=`<div class="auth-backdrop" onclick="closeAuth()"></div><div class="auth-card"><button class="auth-close" onclick="closeAuth()">×</button><p class="eyebrow">eFOOTBALL DREAMERS</p><h2 id="authTitle">Create your account</h2><p class="auth-sub" id="authSub">Join the community with a real online account.</p><form id="authForm"><label>Username<input id="authUsername" maxlength="24" autocomplete="username" placeholder="Dreamer99" required></label><label>Email<input id="authEmail" type="email" autocomplete="email" placeholder="you@example.com" required></label><label>Password<input id="authPassword" type="password" minlength="6" autocomplete="new-password" placeholder="At least 6 characters" required></label><button class="auth-submit" type="submit" id="authSubmit">Create Account →</button></form><p id="authMessage" class="auth-message" aria-live="polite"></p><div class="auth-switch"><span id="authSwitchText">Already have an account?</span> <button id="authSwitchBtn" type="button">Log in</button></div><small class="auth-note">Your password is handled by Supabase Authentication; this website does not store your password.</small></div>`;document.body.appendChild(m);m.querySelector("#authForm").addEventListener("submit",handleAuthSubmit);m.querySelector("#authSwitchBtn").addEventListener("click",()=>setAuthMode(authMode==="signup"?"login":"signup"));return m}
let authMode="signup";
function setAuthMode(mode){authMode=mode;const m=authModal(),title=m.querySelector("#authTitle"),sub=m.querySelector("#authSub"),u=m.querySelector("#authUsername"),submit=m.querySelector("#authSubmit"),sw=m.querySelector("#authSwitchText"),btn=m.querySelector("#authSwitchBtn");m.querySelector("#authMessage").textContent="";m.querySelector("#authForm").reset();if(mode==="login"){title.textContent="Welcome back";sub.textContent="Log in to your eFootball Dreamers account.";u.parentElement.style.display="none";u.required=false;submit.textContent="Log In →";sw.textContent="New to Dreamers?";btn.textContent="Create account"}else{title.textContent="Create your account";sub.textContent="Join the community with a real online account.";u.parentElement.style.display="block";u.required=true;submit.textContent="Create Account →";sw.textContent="Already have an account?";btn.textContent="Log in"}}
function join(){window.location.href="./accounts.html?mode=signup"}
function login(){window.location.href="./accounts.html?mode=login"}
function closeAuth(){const m=document.getElementById("dreamersAuthModal");if(m)m.classList.remove("open")}
async function handleAuthSubmit(e){e.preventDefault();const m=authModal(),msg=m.querySelector("#authMessage"),button=m.querySelector("#authSubmit");msg.className="auth-message";msg.textContent="Connecting securely…";button.disabled=true;try{const sb=await getSupabase(),email=m.querySelector("#authEmail").value.trim().toLowerCase(),password=m.querySelector("#authPassword").value;let result;if(authMode==="signup"){const username=m.querySelector("#authUsername").value.trim();result=await sb.auth.signUp({email,password,options:{data:{username}}});if(result.error)throw result.error;msg.textContent=result.data.session?"✓ Account created and you're logged in!":"✓ Account created. Check your email to confirm your account, then log in."}else{result=await sb.auth.signInWithPassword({email,password});if(result.error)throw result.error;msg.textContent="✓ Login successful. Welcome back!";setTimeout(closeAuth,900)}await refreshAuthUI();await refreshProfile()}catch(err){msg.className="auth-message auth-error";msg.textContent=err.message||"Something went wrong. Please try again."}finally{button.disabled=false}}
async function refreshAuthUI(){try{const sb=await getSupabase(),{data}=await sb.auth.getSession(),logged=!!data.session,buttons=document.querySelectorAll(".nav-actions button");if(buttons.length>=2){buttons[0].textContent=logged?"Logout":"Login";buttons[0].onclick=logged?logout:login;buttons[1].textContent=logged?"My Profile":"Create Account";buttons[1].onclick=logged?showAccount:join}}catch(e){console.warn("Supabase auth unavailable",e)}}
async function logout(){const sb=await getSupabase();await sb.auth.signOut();await refreshAuthUI();await refreshProfile();document.getElementById("profile")?.scrollIntoView({behavior:"smooth"})}
async function showAccount(){document.getElementById("profile")?.scrollIntoView({behavior:"smooth"});await refreshProfile()}
function refreshProfile(){const section=document.getElementById("profile");if(!section)return Promise.resolve();return getSupabase().then(sb=>sb.auth.getUser()).then(({data})=>{const u=data.user,name=u?.user_metadata?.username||u?.email?.split("@")[0]||"Not signed in";const title=section.querySelector("#profileUsername,.profile-name");const email=section.querySelector("#profileEmail,.profile-email");if(title)title.textContent=name;if(email)email.textContent=u?.email||"Create an account to claim your Dreamers profile.";const status=section.querySelector("#profileStatus,.profile-status");if(status)status.textContent=u?"ONLINE • VERIFIED SESSION":"NOT SIGNED IN";const avatar=section.querySelector("#profileAvatar,.profile-avatar");if(avatar)avatar.textContent=u?name.slice(0,2).toUpperCase():"?"})}
function profileStyles(){if(document.getElementById("dreamProfileStyles"))return;const s=document.createElement("style");s.id="dreamProfileStyles";s.textContent=`.profile-preview{border-color:#18384d!important;background:linear-gradient(135deg,#081622,#03080d)!important}.profile-preview .avatar.big{background:radial-gradient(circle at 35% 30%,#28b8ff,#07345a 55%,#02070c);border:2px solid #2caef0;box-shadow:0 0 30px rgba(0,150,255,.18)}.profile-preview h3{font-size:26px!important}.profile-preview .profile-status{display:inline-block;margin-top:6px;color:#43c3ff;border:1px solid #1c5775;border-radius:999px;padding:5px 9px;font-size:9px;letter-spacing:1px}.profile-preview .profile-action{background:#21a7f2;color:#03101a;border:0;font-weight:900}`;document.head.appendChild(s)}
function enhanceProfileSection(){profileStyles();const p=document.getElementById("profile");if(!p)return;let button=p.querySelector("button");if(button){button.textContent="Open My Profile →";button.classList.add("profile-action");button.onclick=showAccount}}
function eventInfo(name){alert(name+" details and registration are coming soon.")}
function react(btn){const n=btn.textContent.match(/\d+/);btn.textContent="♥ "+(n?Number(n[0])+1:1);btn.disabled=true}
function newPost(){alert("Posting will be available when community accounts are connected.")}
function toggleMenu(){document.getElementById("navLinks").classList.toggle("open")}
const firePlayers=[{name:"MBAPPÉ",role:"THE SPEEDSTER",number:10,image:"https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbappe_France_v_Paraguay_4_July_2026-124.jpg",goals:3,assists:2,saves:0,blocks:1,tackles:5},{name:"MESSI",role:"THE MAGICIAN",number:10,image:"https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_Messi_Argentina_v_Egypt_7_July_2026-112.jpg",goals:2,assists:3,saves:0,blocks:2,tackles:6},{name:"RONALDO",role:"THE PHENOMENON",number:7,image:"https://commons.wikimedia.org/wiki/Special:FilePath/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-087.jpg",goals:2,assists:1,saves:0,blocks:3,tackles:4},{name:"NEYMAR",role:"THE SHOWMAN",number:10,image:"https://commons.wikimedia.org/wiki/Special:FilePath/Neymar_Junior_Brazil_V_Morocco_13_June_2026-145.jpg",goals:1,assists:4,saves:0,blocks:2,tackles:8}];
let fireIndex=0,matchSeconds=4044,homeScore=2,awayScore=1;
function fireScoreFor(p){return Math.min(99,70+p.goals*6+p.assists*3+p.saves*2+p.blocks*2+p.tackles)}
function matchClock(){matchSeconds=Math.min(5400,matchSeconds+1);const m=Math.floor(matchSeconds/60),s=matchSeconds%60,el=document.getElementById("matchMinute");if(el)el.textContent=m+":"+String(s).padStart(2,"0")}
function renderFire(){const p=firePlayers[fireIndex],score=fireScoreFor(p),ranked=firePlayers.map((x,i)=>({x,i,s:fireScoreFor(x)})).sort((a,b)=>b.s-a.s),img=document.getElementById("firePlayerImage");if(img){img.src=p.image;img.alt=p.name}const n=document.getElementById("firePlayerName");if(n)n.textContent=p.name;const r=document.getElementById("fireRole");if(r)r.textContent=p.role;const sc=document.getElementById("fireScore");if(sc)sc.textContent=score;const pos=document.getElementById("firePosition");if(pos)pos.textContent="#"+p.number;const reason=document.getElementById("fireReason");if(reason)reason.textContent=p.goals+" GOALS • "+p.assists+" ASSISTS • "+p.tackles+" TACKLES";const status=document.getElementById("fireStatus");if(status)status.textContent=p.name+" is leading";const stats=document.getElementById("fireStats");if(stats)stats.innerHTML='<div class="fire-stat"><b>'+p.goals+'</b><span>⚽ GOALS</span></div><div class="fire-stat"><b>'+p.assists+'</b><span>🎯 ASSISTS</span></div><div class="fire-stat"><b>'+p.saves+'</b><span>🧤 SAVES</span></div><div class="fire-stat"><b>'+p.blocks+'</b><span>🛡 BLOCKS</span></div><div class="fire-stat"><b>'+p.tackles+'</b><span>💪 TACKLES</span></div><div class="fire-stat"><b>'+score+'</b><span>🔥 FORM</span></div>';const board=document.getElementById("fireLeaderboard");if(board)board.innerHTML=ranked.map((v,pos)=>'<button type="button" class="fire-rank '+(v.i===fireIndex?'active':'')+'" onclick="selectFirePlayer('+v.i+')"><strong>'+v.s+'</strong><b>#'+(pos+1)+' '+v.x.name+'</b><small>'+v.x.goals+' G • '+v.x.saves+' S • '+v.x.blocks+' B • '+v.x.tackles+' T</small></button>').join("");const momentum=Math.max(35,Math.min(85,50+(score-85)*2)),hm=document.getElementById("homeMomentum"),am=document.getElementById("awayMomentum"),fill=document.getElementById("momentumFill");if(hm)hm.textContent=Math.round(momentum)+"%";if(am)am.textContent=Math.round(100-momentum)+"%";if(fill)fill.style.width=momentum+"%";const mt=document.getElementById("momentumText");if(mt)mt.textContent=momentum>=50?"DREAMERS FC":"RIVALS XI";const hs=document.getElementById("homeScore"),as=document.getElementById("awayScore");if(hs)hs.textContent=homeScore;if(as)as.textContent=awayScore}
function selectFirePlayer(i){fireIndex=i;renderFire()}function nextFirePlayer(){fireIndex=(fireIndex+1)%firePlayers.length;renderFire()}function fireEvent(type){const p=firePlayers[fireIndex];let eventText="";if(type==="goal"){p.goals++;homeScore++;eventText=p.name+" scores! ⚽ DREAMERS FC "+homeScore+" — "+awayScore}if(type==="save"){p.saves++;eventText=p.name+" makes a huge save! 🧤"}if(type==="block"){p.blocks++;eventText=p.name+" makes the block! 🛡"}if(type==="tackle"){p.tackles++;eventText=p.name+" wins the tackle! 💪"}fireIndex=firePlayers.map((x,i)=>({i,s:fireScoreFor(x)})).sort((a,b)=>b.s-a.s)[0].i;renderFire();const ev=document.getElementById("matchEvent");if(ev)ev.textContent=eventText}
document.addEventListener("DOMContentLoaded",async()=>{accountStyles();authModal();profileStyles();enhanceProfileSection();renderFire();setInterval(matchClock,1000);await refreshAuthUI();await refreshProfile()});

/* Tournament Match Center */
function getSubmittedMatches(){try{return JSON.parse(localStorage.getItem("dreamersMatches")||"[]")}catch(e){return[]}}
function saveSubmittedMatches(list){localStorage.setItem("dreamersMatches",JSON.stringify(list))}
function escapeMatch(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]))}
function updateMatchPreview(){const p=document.getElementById("playerName"),o=document.getElementById("opponentName"),a=document.getElementById("yourScore"),b=document.getElementById("opponentScore"),g=document.getElementById("goals"),as=document.getElementById("assists"),t=document.getElementById("tackles"),sv=document.getElementById("saves");if(!p||!o)return;const ps=Number(a.value)||0,os=Number(b.value)||0,r=ps>os?"WIN":ps<os?"LOSS":"DRAW";const rating=Math.max(50,Math.min(99,68+Number(g.value||0)*5+Number(as.value||0)*3+Number(t.value||0)+Number(sv.value||0)*2));document.getElementById("previewPlayer").textContent=p.value.trim()||"Dreamer99";document.getElementById("previewOpponent").textContent=o.value.trim()||"RivalKing";document.getElementById("previewScore").textContent=ps+" — "+os;document.getElementById("liveResult").textContent=r;document.getElementById("performanceRating").textContent=rating;document.getElementById("ratingBar").style.width=rating+"%";document.getElementById("resultBadge").textContent=r==="WIN"?"READY TO WIN":r==="LOSS"?"READY TO REPORT":"READY TO REPORT"}
function submitMatch(e){e.preventDefault();const match={player:document.getElementById("playerName").value.trim(),opponent:document.getElementById("opponentName").value.trim(),yourScore:Number(document.getElementById("yourScore").value)||0,opponentScore:Number(document.getElementById("opponentScore").value)||0,goals:Number(document.getElementById("goals").value)||0,assists:Number(document.getElementById("assists").value)||0,tackles:Number(document.getElementById("tackles").value)||0,saves:Number(document.getElementById("saves").value)||0,tournament:true,date:new Date().toLocaleString()};const list=getSubmittedMatches();list.unshift(match);saveSubmittedMatches(list.slice(0,20));document.getElementById("matchSaved").textContent="✓ Official result saved on this device. Your standings entry is recorded.";renderSubmittedMatches();renderStandings();e.target.reset();document.getElementById("yourScore").value=0;document.getElementById("opponentScore").value=0;updateMatchPreview()}
function renderSubmittedMatches(){const box=document.getElementById("submittedMatches");if(!box)return;const list=getSubmittedMatches();box.innerHTML=list.length?list.map(m=>'<div class="submitted-match"><span><strong>'+escapeMatch(m.player)+'</strong> vs '+escapeMatch(m.opponent)+' <small>• '+escapeMatch(m.date)+'</small></span><b>'+m.yourScore+' — '+m.opponentScore+'</b><span>'+m.goals+' G • '+m.assists+' A • '+m.tackles+' T • '+m.saves+' S</span></div>').join(""):""}
const tournamentSeed=[{name:"Dreamer99",p:3,w:3,d:0,l:0,gf:9,ga:2},{name:"RivalKing",p:3,w:2,d:0,l:1,gf:7,ga:4},{name:"ProGamer",p:3,w:1,d:1,l:1,gf:5,ga:5},{name:"AtlasFC",p:3,w:1,d:0,l:2,gf:4,ga:7},{name:"SkillMaster",p:3,w:0,d:1,l:2,gf:3,ga:8}];
function buildTournamentStandings(){const map={};tournamentSeed.forEach(x=>map[x.name]={...x});getSubmittedMatches().forEach(m=>{if(!m.tournament)return;const a=m.player,b=m.opponent;if(!a||!b)return;if(!map[a])map[a]={name:a,p:0,w:0,d:0,l:0,gf:0,ga:0};if(!map[b])map[b]={name:b,p:0,w:0,d:0,l:0,gf:0,ga:0};const A=map[a],B=map[b],as=Number(m.yourScore)||0,bs=Number(m.opponentScore)||0;A.p++;B.p++;A.gf+=as;A.ga+=bs;B.gf+=bs;B.ga+=as;if(as>bs){A.w++;B.l++}else if(as<bs){B.w++;A.l++}else{A.d++;B.d++}});return Object.values(map).map(x=>({...x,gd:x.gf-x.ga,pts:x.w*3+x.d})).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf)}
function renderStandings(){const body=document.getElementById("standingsBody");if(!body)return;const rows=buildTournamentStandings();body.innerHTML=rows.map((x,i)=>'<tr><td>'+String(i+1).padStart(2,"0")+'</td><td>'+escapeMatch(x.name)+'</td><td>'+x.p+'</td><td>'+x.w+'</td><td>'+x.d+'</td><td>'+x.l+'</td><td>'+x.gf+'</td><td>'+x.ga+'</td><td>'+((x.gd>0?"+":"")+x.gd)+'</td><td>'+x.pts+'</td></tr>').join("");const status=document.getElementById("standingsStatus");if(status)status.textContent=rows.length+" players • auto-updated"}
document.addEventListener("DOMContentLoaded",()=>{renderSubmittedMatches();renderStandings();updateMatchPreview();["playerName","opponentName","yourScore","opponentScore","goals","assists","tackles","saves"].forEach(id=>document.getElementById(id)?.addEventListener("input",updateMatchPreview))});

/* Dreamers Player Hub */
/* Dreamers Player Hub — stable card system */
const dreamersPlayers=[
 {id:"speed-hunter",name:"Speed Hunter",nation:"🇫🇷 France",pos:"CF",rating:96,style:"Goal Poacher",pace:98,shoot:94,pass:82,dribble:95,def:42,tone:"scarlet",mark:"SH"},
 {id:"playmaker-x",name:"Playmaker X",nation:"🇦🇷 Argentina",pos:"AMF",rating:95,style:"Creative Playmaker",pace:88,shoot:86,pass:98,dribble:96,def:48,tone:"crimson",mark:"PX"},
 {id:"engine-core",name:"Engine Core",nation:"🇪🇸 Spain",pos:"CMF",rating:94,style:"Box-to-Box",pace:89,shoot:78,pass:93,dribble:88,def:86,tone:"ruby",mark:"EC"},
 {id:"shield-one",name:"Shield One",nation:"🇧🇷 Brazil",pos:"DMF",rating:93,style:"Anchor Man",pace:78,shoot:58,pass:86,dribble:74,def:96,tone:"ember",mark:"SO"},
 {id:"wall-master",name:"Wall Master",nation:"🇳🇱 Netherlands",pos:"CB",rating:94,style:"Build Up",pace:82,shoot:42,pass:76,dribble:61,def:98,tone:"darkred",mark:"WM"},
 {id:"last-line",name:"Last Line",nation:"🇩🇪 Germany",pos:"GK",rating:92,style:"Defensive GK",pace:64,shoot:20,pass:72,dribble:35,def:97,tone:"inferno",mark:"LL"}
];
let selectedDreamersPlayers=new Set();

function escapeHub(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]))}

function renderDreamersPlayers(list=dreamersPlayers){
 const grid=document.getElementById("dreamersPlayerGrid"); if(!grid)return;
 grid.innerHTML=list.length ? list.map(p=>{
   const selected=selectedDreamersPlayers.has(p.id);
   return '<article class="dreamer-player-card efootball-inspired '+p.tone+(selected?' selected':'')+'">'+
    '<div class="card-scan"></div><div class="player-card-top"><div><span class="player-rarity">DREAMERS</span><span class="player-position">'+p.pos+'</span></div><div class="player-rating"><small>OVR</small><b>'+p.rating+'</b></div></div>'+
    '<div class="card-art"><span class="card-watermark">'+p.pos+'</span><div class="player-silhouette">'+p.mark+'</div><div class="card-art-label">PLAYER HUB</div></div>'+
    '<div class="card-player-info"><div><h3>'+escapeHub(p.name)+'</h3><span class="player-nation">'+escapeHub(p.nation)+'</span></div><span class="player-style">'+escapeHub(p.style)+'</span></div>'+
    '<div class="player-mini-stats"><span><b>'+p.pace+'</b><small>SPD</small></span><span><b>'+p.shoot+'</b><small>SHT</small></span><span><b>'+p.pass+'</b><small>PAS</small></span><span><b>'+p.dribble+'</b><small>DRB</small></span><span><b>'+p.def+'</b><small>DEF</small></span></div>'+
    '<button type="button" class="select-player" onclick="toggleDreamersPlayer(\''+p.id+'\')">'+(selected?'✓ SELECTED':'＋ COMPARE')+'</button>'+
   '</article>';
 }).join(""):'<div class="hub-empty">No players found. Try another search.</div>';
}

function filterDreamersPlayers(){
 const q=(document.getElementById("playerSearch")?.value||"").toLowerCase().trim();
 const f=document.getElementById("playerFilter")?.value||"ALL";
 renderDreamersPlayers(dreamersPlayers.filter(p=>(f==="ALL"||p.pos===f)&&[p.name,p.pos,p.style,p.nation].join(" ").toLowerCase().includes(q)));
}

function toggleDreamersPlayer(id){
 const p=dreamersPlayers.find(x=>x.id===id); if(!p)return;
 if(selectedDreamersPlayers.has(id)) selectedDreamersPlayers.delete(id);
 else if(selectedDreamersPlayers.size<2) selectedDreamersPlayers.add(id);
 else { const status=document.getElementById("playerCompare"); if(status){status.hidden=false;status.innerHTML="<b>MAX 2 PLAYERS</b><span>Remove one selected player before choosing another.</span>"} return; }
 filterDreamersPlayers();
}

function compareDreamersPlayers(){
 const box=document.getElementById("playerCompare"),arr=dreamersPlayers.filter(p=>selectedDreamersPlayers.has(p.id)); if(!box)return;
 box.hidden=false;
 if(arr.length<2){box.innerHTML="<div><small>PLAYER COMPARISON</small><h3>SELECT TWO PLAYERS</h3><span>Choose two cards above to compare their strengths.</span></div>";return}
 box.innerHTML="<div><small>PLAYER COMPARISON</small><h3>"+escapeHub(arr[0].name)+" <span>VS</span> "+escapeHub(arr[1].name)+"</h3></div><div class=\"compare-grid\">"+["rating","pace","shoot","pass","dribble","def"].map(k=>"<span>"+k.toUpperCase()+"</span><b>"+arr[0][k]+"</b><i><em style=\"width:"+arr[0][k]+"%\"></em></i><b>"+arr[1][k]+"</b>").join("")+"</div>";
}

document.addEventListener("DOMContentLoaded",()=>renderDreamersPlayers());

/* Dreamers Invite System */
function dreamersInviteMessage(){const url=window.location.href.split("?")[0].split("#")[0];return "Join me on eFootball Dreamers ⚽🔥\n\nA new community for eFootball players, tournaments, player tools and more.\n\n"+url}
async function shareDreamers(channel){const url=window.location.href.split("?")[0].split("#")[0],message=dreamersInviteMessage(),encodedUrl=encodeURIComponent(url),encodedText=encodeURIComponent(message),status=document.getElementById("inviteStatus");if(status)status.textContent="";try{if(channel==="copy"){await navigator.clipboard.writeText(message);if(status)status.textContent="✓ Invitation copied — paste it anywhere you want.";return}if(channel==="whatsapp"){window.open("https://wa.me/?text="+encodedText,"_blank","noopener");return}if(channel==="gmail"){window.open("https://mail.google.com/mail/?view=cm&fs=1&su="+encodeURIComponent("Join me on eFootball Dreamers ⚽🔥")+"&body="+encodedText,"_blank","noopener");return}if(channel==="twitter"){window.open("https://twitter.com/intent/tweet?text="+encodedText,"_blank","noopener");return}if(channel==="telegram"){window.open("https://t.me/share/url?url="+encodedUrl+"&text="+encodeURIComponent("Join me on eFootball Dreamers ⚽🔥"),"_blank","noopener");return}if(channel==="instagram"){await navigator.clipboard.writeText(message);window.open("https://www.instagram.com/","_blank","noopener");if(status)status.textContent="✓ Invitation copied. Open Instagram and paste it into a DM, Story or post.";return}if(navigator.share){await navigator.share({title:"eFootball Dreamers",text:message,url});}else{await navigator.clipboard.writeText(message);if(status)status.textContent="✓ Invitation copied to your clipboard."}}catch(err){if(status&&!/AbortError/.test(err.name||""))status.textContent="Copy the invitation and share it from your preferred app."}}

/* Dreamers Featured Player Cards */
const featuredDreamersCards=[
{name:"Kylian Mbappé",team:"FRANCE",pos:"CF",rating:99,style:"Goal Poacher",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbappe_-_France_v_Norway_-_26_June_2026.jpg",stats:[98,96,87,97]},
{name:"Lionel Messi",team:"ARGENTINA",pos:"AMF",rating:98,style:"Creative Playmaker",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_Messi_Argentina_v_Egypt_7_July_2026-207.jpg",stats:[86,94,97,99]},
{name:"Cristiano Ronaldo",team:"PORTUGAL",pos:"CF",rating:98,style:"Goal Poacher",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Christiano_Ronaldo_at_world_cup_match_2026.jpg",stats:[91,98,88,91]},
{name:"Neymar Jr",team:"BRAZIL",pos:"LWF",rating:96,style:"Creative Playmaker",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Neymar.jpg",stats:[93,91,95,98]}
];
function renderFeaturedCards(){const grid=document.getElementById("featuredCardGrid");if(!grid)return;grid.innerHTML=featuredDreamersCards.map((p,i)=>'<article class="featured-player-card"><div class="card-shine"></div><div class="fc-top"><span>EPIC</span><b>'+p.rating+'</b></div><div class="fc-image-wrap"><img src="'+p.image+'" alt="'+p.name+'" loading="lazy" onerror="this.style.display=\'none\'"><div class="fc-position">'+p.pos+'</div></div><div class="fc-info"><small>'+p.team+' • '+p.style+'</small><h3>'+p.name+'</h3><div class="fc-stats"><span><b>'+p.stats[0]+'</b>SPD</span><span><b>'+p.stats[1]+'</b>SHT</span><span><b>'+p.stats[2]+'</b>PAS</span><span><b>'+p.stats[3]+'</b>DRB</span></div><button type="button" onclick="openDreamersPlayerCard('+i+')">VIEW PLAYER →</button></div></article>').join("")}
function openDreamersPlayerCard(i){const p=featuredDreamersCards[i];alert(p.name+"\n"+p.pos+" • "+p.style+"\nDreamers demo rating: "+p.rating+"\n\nThis is a Dreamers-designed card, not an official eFootball card.");}
document.addEventListener("DOMContentLoaded",renderFeaturedCards);

/* Dreamers Build Lab */
const dreamersBuildPlayers=[
 {name:"Ruud Gullit",initials:"RG",rating:90,pos:"SS",nation:"🇳🇱 Netherlands",style:"Target Man",attack:94,summary:"A powerful all-round attacker who can link play and finish from central areas.",best:["SS / AMF","Quick Counter","Power + movement","Finishing / Physical / Passing"],base:{SPD:86,SHT:91,PAS:87,DRB:85,DEF:62},tips:"Keep him central, then use his physical strength to create space and finish."},
 {name:"Edgar Davids",initials:"ED",rating:89,pos:"DMF",nation:"🇳🇱 Netherlands",style:"Box-to-Box",attack:81,summary:"A high-energy midfielder built to press, recover and keep the team moving.",best:["DMF / CMF","Possession Game","Ball recovery","Defending / Passing / Stamina"],base:{SPD:84,SHT:72,PAS:84,DRB:82,DEF:91},tips:"Prioritize defensive work and passing so he can win the ball and immediately restart attacks."},
 {name:"Lionel Messi",initials:"LM",rating:91,pos:"RWF",nation:"🇦🇷 Argentina",style:"Creative Playmaker",attack:98,summary:"A creative wide attacker who benefits from close control, passing and finishing.",best:["RWF / AMF","Possession Game","Close control","Dribbling / Passing / Shooting"],base:{SPD:88,SHT:91,PAS:97,DRB:99,DEF:42},tips:"Use him between the wing and half-space; let his dribbling and passing create the final action."},
 {name:"Neymar Jr",initials:"NJ",rating:90,pos:"LWF",nation:"🇧🇷 Brazil",style:"Creative Playmaker",attack:96,summary:"A technical wide creator who thrives when he has freedom to receive and combine.",best:["LWF / AMF","Possession Game","Dribbling","Dribbling / Passing / Shooting"],base:{SPD:91,SHT:87,PAS:94,DRB:98,DEF:38},tips:"Give him the ball early and let him attack isolated defenders before combining centrally."},
 {name:"Frank Rijkaard",initials:"FR",rating:90,pos:"CB",nation:"🇳🇱 Netherlands",style:"Build Up",attack:70,summary:"A composed defensive anchor suited to structured possession and controlled buildup.",best:["CB / DMF","Possession Game","Defensive positioning","Defending / Passing / Physical"],base:{SPD:78,SHT:54,PAS:86,DRB:63,DEF:96},tips:"Keep him behind the midfield line and use his passing to escape pressure safely."},
 {name:"Dreamers Finisher",initials:"DF",rating:95,pos:"CF",nation:"🌍 Dreamers",style:"Goal Poacher",attack:99,summary:"A demo profile for testing the Build Lab before more player versions are added.",best:["CF","Quick Counter","Runs in behind","Shooting / Speed / Dribbling"],base:{SPD:96,SHT:98,PAS:78,DRB:91,DEF:30},tips:"Use this demo to test the interface. Replace it with a verified player version when data is available."}
];
const dreamersCoachPresets=[
 {id:"qc",icon:"⚡",name:"Quick Counter",desc:"Fast transitions & runs",score:96,mult:{SPD:3,SHT:3,PAS:-2,DRB:2,DEF:-1},plan:"OFFENSIVE",style:"Quick Counter"},
 {id:"pos",icon:"🎯",name:"Possession Game",desc:"Control & combinations",score:95,mult:{SPD:-1,SHT:1,PAS:4,DRB:4,DEF:0},plan:"TECHNICAL",style:"Possession Game"},
 {id:"ow",icon:"↗",name:"Out Wide",desc:"Width & crossing lanes",score:92,mult:{SPD:3,SHT:1,PAS:2,DRB:3,DEF:-1},plan:"WIDE ATTACK",style:"Out Wide"},
 {id:"lbc",icon:"🛡",name:"Long Ball Counter",desc:"Compact defence & breaks",score:91,mult:{SPD:2,SHT:3,PAS:-1,DRB:0,DEF:4},plan:"COUNTER",style:"Long Ball Counter"}
];
let activeBuildPlayer=0,activeCoach="qc";
function buildValue(base,key,mult){return Math.max(1,Math.min(99,base[key]+(mult[key]||0)))}
function renderBuildLab(){
 const list=document.getElementById("buildPlayerList"),grid=document.getElementById("coachPresetGrid");if(!list||!grid)return;
 list.innerHTML=dreamersBuildPlayers.map((p,i)=>'<button type="button" class="build-player-row '+(i===activeBuildPlayer?'active':'')+'" onclick="selectBuildPlayer('+i+')"><span class="build-avatar">'+p.initials+'</span><span><b>'+p.name+'</b><small>'+p.pos+' • '+p.style+'</small></span><strong class="build-mini-rating">'+p.rating+'</strong></button>').join("");
 const p=dreamersBuildPlayers[activeBuildPlayer],coach=dreamersCoachPresets.find(x=>x.id===activeCoach)||dreamersCoachPresets[0];
 document.getElementById("buildRating").textContent=p.rating;document.getElementById("buildPos").textContent=p.pos;document.getElementById("buildInitials").textContent=p.initials;
 document.getElementById("buildName").textContent=p.name;document.getElementById("buildNation").textContent=p.nation;document.getElementById("buildStyle").textContent=p.style;document.getElementById("buildSummary").textContent=p.summary;
 document.getElementById("buildAttack").textContent=p.attack;document.getElementById("buildAttackBar").style.width=p.attack+"%";
 document.getElementById("buildBestPosition").textContent=p.best[0];document.getElementById("buildBestPlaystyle").textContent=coach.style;document.getElementById("buildKeyStrength").textContent=p.best[2];document.getElementById("buildIdea").textContent=p.best[3];
 document.getElementById("buildPlanLabel").textContent=coach.plan;document.getElementById("buildRoleLabel").textContent=p.pos;document.getElementById("buildTip").textContent=p.tips;
 grid.innerHTML=dreamersCoachPresets.map(c=>'<button type="button" class="coach-preset '+(c.id===activeCoach?'active':'')+'" onclick="selectBuildCoach(\''+c.id+'\')"><span class="coach-score">'+c.score+'</span><div class="coach-icon">'+c.icon+'</div><b>'+c.name+'</b><small>'+c.desc+'</small></button>').join("");
 const attrs=["SPD","SHT","PAS","DRB","DEF"],map={SPD:"SPD",SHT:"SHT",PAS:"PAS",DRB:"DRB",DEF:"DEF"};
 document.getElementById("buildAttributes").innerHTML=attrs.map(k=>{const v=buildValue(p.base,map[k],coach.mult);return '<div class="attr-line"><span>'+k+'</span><div class="attr-track"><i style="width:'+v+'%"></i></div><b>'+v+'</b></div>'}).join("");
}
function selectBuildPlayer(i){activeBuildPlayer=i;renderBuildLab()}
function selectBuildCoach(id){activeCoach=id;renderBuildLab()}
document.addEventListener("DOMContentLoaded",renderBuildLab);

/* GOD MODE Build Lab controls */
function godBuildData(){
 const p=dreamersBuildPlayers[activeBuildPlayer],coach=dreamersCoachPresets.find(x=>x.id===activeCoach)||dreamersCoachPresets[0];
 const attrs={};["SPD","SHT","PAS","DRB","DEF"].forEach(k=>attrs[k]=buildValue(p.base,k,coach.mult));
 return {player:p.name,rating:p.rating,position:p.pos,coach:coach.name,style:p.style,attributes:attrs,savedAt:new Date().toISOString()};
}
function godBuildStatus(message){
 const el=document.getElementById("godBuildStatus");if(el){el.textContent=message;clearTimeout(window.godBuildStatusTimer);window.godBuildStatusTimer=setTimeout(()=>el.textContent="",2600)}
}
function saveGodBuild(){
 const data=godBuildData();
 localStorage.setItem("dreamersGodBuild",JSON.stringify(data));
 godBuildStatus("✓ BUILD SAVED ON THIS DEVICE");
}
async function copyGodBuild(){
 const d=godBuildData();
 const text="eFootball Dreamers GOD BUILD\n"+d.player+" • "+d.position+" • "+d.rating+" OVR\nCoach: "+d.coach+"\nSPD "+d.attributes.SPD+" • SHT "+d.attributes.SHT+" • PAS "+d.attributes.PAS+" • DRB "+d.attributes.DRB+" • DEF "+d.attributes.DEF;
 try{await navigator.clipboard.writeText(text);godBuildStatus("✓ BUILD COPIED TO CLIPBOARD")}catch(e){godBuildStatus("Copy unavailable — use SAVE BUILD")}
}
function resetGodBuild(){activeBuildPlayer=0;activeCoach="qc";renderBuildLab();godBuildStatus("↺ BUILD LAB RESET")}
function loadGodBuild(){
 try{
  const d=JSON.parse(localStorage.getItem("dreamersGodBuild")||"null");
  if(!d)return;
  const pi=dreamersBuildPlayers.findIndex(p=>p.name===d.player),ci=dreamersCoachPresets.findIndex(x=>x.name===d.coach);
  if(pi>=0)activeBuildPlayer=pi;if(ci>=0)activeCoach=dreamersCoachPresets[ci].id;renderBuildLab();
 }catch(e){}
}
document.addEventListener("DOMContentLoaded",loadGodBuild);
