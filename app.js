const KEY="the-reset-v2";const today=()=>new Date().toISOString().slice(0,10);
let s=JSON.parse(localStorage.getItem(KEY)||"null")||{profile:{name:"My Reset",theme:"soft"},habits:["Drink water","10 min tidy","Read 10 pages"],done:{},tasks:[],goals:[],journal:[],xp:0,streak:0,lastDay:null,theme:"soft",dark:false};
function save(){localStorage.setItem(KEY,JSON.stringify(s))}
function go(p){s.page=p;render()}function complete(id){let d=s.done[today()]||{};d[id]=!d[id];s.done[today()]=d;if(d[id])s.xp+=10;save();render()}
function home(){let d=s.done[today()]||{}, total=s.habits.length+3, done=s.habits.filter((_,i)=>d["h"+i]).length+(d.morning?1:0)+(d.study?1:0)+(d.journal?1:0);let pct=Math.round(done/Math.max(total,1)*100);
return `<div class="hero"><div class="eyebrow">TODAY'S RESET</div><div class="big">You don't need a perfect day. Just a fresh start. ✨</div><div class="row"><span class="small">${pct}% reset</span><span class="small">🔥 ${s.streak} day streak</span></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div></div>
<div class="grid"><div class="card tile" onclick="go('routines')"><div class="emoji">☀️</div><div class="title">Routines</div><div class="small">Morning + evening</div></div><div class="card tile" onclick="go('habits')"><div class="emoji">🌱</div><div class="title">Habits</div><div class="small">Tiny daily wins</div></div><div class="card tile" onclick="go('study')"><div class="emoji">📚</div><div class="title">Study</div><div class="small">Focus & tasks</div></div><div class="card tile" onclick="go('goals')"><div class="emoji">🎯</div><div class="title">Goals</div><div class="small">Milestones</div></div><div class="card tile" onclick="go('journal')"><div class="emoji">📖</div><div class="title">Journal</div><div class="small">Your thoughts</div></div><div class="card tile" onclick="go('customise')"><div class="emoji">🎀</div><div class="title">Customise</div><div class="small">Make it yours</div></div></div>
<div class="card section"><div class="title">Little reminder 💗</div><p class="quote">“Small steps still count. You are allowed to grow at your own pace.”</p></div>`}
function listPage(title,items,kind){return `<div class="row"><h1>${title}</h1><button class="primary" onclick="addItem('${kind}')">+ Add</button></div><div class="list">${items.map((x,i)=>`<div class="item"><input type="checkbox" ${x.done?'checked':''} onchange="toggleItem('${kind}',${i})"><span>${x.text||x}</span></div>`).join("")||'<div class="card muted">Nothing here yet — add your first one 💗</div>'}</div>`}
function routines(){return `<h1>Routines</h1><div class="card section"><div class="title">☀️ Morning reset</div><div class="list">${["Wake up + open curtains","Get ready","Drink some water","Pick 1 priority"].map((x,i)=>`<div class="item"><input type="checkbox" ${s.done[today()]?.["m"+i]?"checked":""} onchange="complete('m${i}')"><span>${x}</span></div>`).join("")}</div></div><div class="card section"><div class="title">🌙 Evening reset</div><div class="list">${["Tidy your space","Pack for tomorrow","Write one good thing","Wind down"].map((x,i)=>`<div class="item"><input type="checkbox"><span>${x}</span></div>`).join("")}</div></div>`}
function habits(){return `<h1>Habits 🌱</h1><div class="list">${s.habits.map((x,i)=>`<div class="item"><input type="checkbox" ${s.done[today()]?.["h"+i]?"checked":""} onchange="complete('h${i}')"><span>${x}</span></div>`).join("")}</div><button class="primary section" onclick="addItem('habit')">+ New habit</button>`}
function study(){return `<h1>Study 📚</h1><div class="card"><input id="task" placeholder="Add a study task..."><button class="primary" onclick="addStudy()">Add task</button></div><div class="list">${s.tasks.map((x,i)=>`<div class="item"><input type="checkbox" ${x.done?'checked':''} onchange="s.tasks[${i}].done=this.checked;save();render()"><span>${x.text}</span></div>`).join("")}</div><div class="card section"><div class="title">Focus timer</div><div id="timer" class="timer">10:00</div><div class="row"><button class="primary" onclick="startTimer()">Start</button><button class="secondary" onclick="stopTimer()">Reset</button></div></div>`}
function goals(){return `<div class="row"><h1>Goals 🎯</h1><button class="primary" onclick="addGoal()">+ Goal</button></div><div class="list">${s.goals.map((g,i)=>`<div class="card"><div class="row"><div><div class="title">${g.text}</div><div class="small">${g.steps.length} milestone${g.steps.length===1?'':'s'}</div></div><button class="secondary" onclick="addMilestone(${i})">+ Step</button></div><div class="list">${g.steps.map((st,j)=>`<div class="item"><input type="checkbox" ${st.done?'checked':''} onchange="s.goals[${i}].steps[${j}].done=this.checked;save();render()"><span>${st.text}</span></div>`).join("")}</div></div>`).join("")||'<div class="card muted">Your next chapter starts with one goal.</div>'}</div>`}
function journal(){return `<h1>Journal 📖</h1><div class="card"><div class="title">Today's prompt</div><p class="quote">What would make today feel like a little win?</p><textarea id="journalText" placeholder="Write whatever is on your mind..."></textarea><button class="primary" onclick="saveJournal()">Save entry</button></div><div class="section"><h2>Past entries</h2>${s.journal.slice().reverse().map(e=>`<div class="card section"><div class="small">${e.date}</div><p>${escapeHtml(e.text)}</p></div>`).join("")||'<div class="muted">Your entries will appear here.</div>'}</div>`}
function planner(){let ds=[...Array(7)].map((_,i)=>{let d=new Date();d.setDate(d.getDate()+i);return d.toISOString().slice(0,10)});return `<h1>Planner 📅</h1><div class="card"><input id="plan" placeholder="What needs doing?"><select id="planDate">${ds.map(d=>`<option>${d}</option>`).join("")}</select><button class="primary" onclick="addPlan()">Add</button></div><div class="list">${s.tasks.filter(x=>x.plan).map(x=>`<div class="item"><span>${x.date}</span><span>${x.text}</span></div>`).join("")}</div>`}
function progress(){let days=Object.keys(s.done).slice(-7);let vals=days.map(d=>Object.values(s.done[d]||{}).filter(Boolean).length);let max=Math.max(1,...vals);return `<h1>Progress ✨</h1><div class="grid"><div class="card"><div class="small">XP</div><div class="big">${s.xp}</div></div><div class="card"><div class="small">Streak</div><div class="big">🔥 ${s.streak}</div></div></div><div class="card section"><div class="title">Last 7 active days</div><div class="chart">${vals.map(v=>`<div class="col" style="height:${Math.max(8,v/max*100)}%" title="${v} wins"></div>`).join("")||'<span class="muted">Start checking things off to see your chart.</span>'}</div></div><div class="card"><div class="title">Achievements 🏆</div><span class="badge">🌱 First step</span>${s.xp>=50?'<span class="badge">⭐ 50 XP</span>':''}${s.streak>=3?'<span class="badge">🔥 3-day streak</span>':''}${s.journal.length>=3?'<span class="badge">📖 Journaler</span>':''}</div>`}
function customise(){return `<h1>Customise 🎀</h1><div class="card"><div class="title">Theme</div><div class="list">${["soft","clean","sparkle","night"].map(t=>`<button class="secondary" onclick="setTheme('${t}')">${t}</button>`).join("")}</div><div class="title section">Dark mode</div><button class="primary" onclick="s.dark=!s.dark;save();applyTheme();render()">${s.dark?'Turn off':'Turn on'} dark mode</button><div class="title section">Daily reminders</div><button class="secondary" onclick="notifyMe()">Enable browser reminder</button></div>`}
function profile(){return `<h1>Profile 💗</h1><div class="card"><input id="name" value="${escapeAttr(s.profile.name)}"><button class="primary" onclick="s.profile.name=document.getElementById('name').value||'My Reset';save();closeModal();render()">Save profile</button><p class="small">Your data is stored on this device using local storage.</p></div>`}
function render(){let p=s.page||"home", map={home, routines, habits, study, goals, journal, planner, progress, customise};document.getElementById("screen").innerHTML=(map[p]||home)();applyTheme()}
function applyTheme(){document.documentElement.dataset.theme=s.theme;document.body.classList.toggle("dark",!!s.dark)}
function addStudy(){let v=document.getElementById("task").value.trim();if(v){s.tasks.push({text:v,done:false});save();render()}}
function addPlan(){let v=document.getElementById("plan").value.trim();if(v){s.tasks.push({text:v,plan:true,date:document.getElementById("planDate").value});save();render()}}
function saveJournal(){let v=document.getElementById("journalText").value.trim();if(v){s.journal.push({text:v,date:today()});s.xp+=5;save();render()}}
function addItem(k){let v=prompt(k==="habit"?"New habit:":`New ${k}:`);if(!v)return;if(k==="habit")s.habits.push(v);save();render()}
function addGoal(){let v=prompt("Goal:");if(v){s.goals.push({text:v,steps:[]});save();render()}}
function addMilestone(i){let v=prompt("Milestone:");if(v){s.goals[i].steps.push({text:v,done:false});save();render()}}
function toggleItem(k,i){if(k==="habit"){s.done[today()]=s.done[today()]||{};s.done[today()]["h"+i]=!s.done[today()]["h"+i];save();render()}}
let timerId=null,seconds=600;function startTimer(){if(timerId)return;timerId=setInterval(()=>{seconds--;let el=document.getElementById("timer");if(el)el.textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;if(seconds<=0)stopTimer()},1000)}function stopTimer(){clearInterval(timerId);timerId=null;seconds=600;let el=document.getElementById("timer");if(el)el.textContent="10:00"}
function openProfile(){document.getElementById("modal").innerHTML=`<div>${profile()}<button class="secondary" onclick="closeModal()">Close</button></div>`;document.getElementById("modal").classList.remove("hidden")}function closeModal(){document.getElementById("modal").classList.add("hidden")}
function setTheme(t){s.theme=t;save();applyTheme();render()}
async function notifyMe(){if(!("Notification" in window)){alert("Notifications aren't supported here.");return}let p=await Notification.requestPermission();if(p==="granted")new Notification("THE RESET ✨",{body:"Tiny steps still count. Time for your reset!"})}
function escapeHtml(x){return x.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}function escapeAttr(x){return escapeHtml(x)}
window.addEventListener("load",()=>{if(s.lastDay!==today()){let y=new Date();y.setDate(y.getDate()-1);if(s.lastDay===y.toISOString().slice(0,10))s.streak++;else if(s.lastDay) s.streak=0;s.lastDay=today();save()}render()})

if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));

/* THE RESET — final polish */
(function(){
  s.profile=s.profile||{name:"My Reset",theme:"soft"};
  s.profile.theme=s.profile.theme||"soft";
  s.profile.welcome = s.profile.welcome !== false;

  window.finishWelcome=function(){
    s.profile.welcome=false; s.profile.name=s.profile.name||"My Reset"; save(); render(); toast("Welcome to your reset ✨");
  };

  const baseHome=home;
  window.home=function(){
    const base=baseHome();
    const d=s.done[today()]||{};
    const wins=Object.values(d).filter(Boolean).length;
    return base + `<div class="card section"><div class="stat-grid">
      <div class="stat"><span class="small">XP</span><b>${s.xp}</b></div>
      <div class="stat"><span class="small">Today</span><b>${wins}</b></div>
      <div class="stat"><span class="small">Streak</span><b>🔥 ${s.streak}</b></div>
    </div></div>`;
  };

  const baseProgress=progress;
  window.progress=function(){
    let extra="";
    let arr=[];
    for(let i=6;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i);let k=d.toISOString().slice(0,10),n=Object.values(s.done[k]||{}).filter(Boolean).length;arr.push({k,n,label:d.toLocaleDateString(undefined,{weekday:"short"}).slice(0,2),day:d.getDate()});}
    extra=`<div class="card section"><div class="title">Streak calendar 🔥</div><div class="calendar">${arr.map(x=>`<div class="day ${x.n?'done':''} ${x.k===today()?'today':''}">${x.label}<br>${x.day}</div>`).join("")}</div></div>`;
    return baseProgress()+extra;
  };

  const baseCustomise=customise;
  window.customise=function(){
    return baseCustomise()+`<div class="card section"><div class="title">Install THE RESET 📱</div>
      <p class="small">Add it to your home screen so it feels like your own app.</p>
      <button class="secondary" onclick="installReset()">Add to home screen</button></div>`;
  };

  window.installReset=async function(){
    if(window.deferredPrompt){window.deferredPrompt.prompt();window.deferredPrompt=null;return;}
    toast("In Chrome: ⋮ → Add to home screen 📱");
  };

  window.deferredPrompt=null;
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();window.deferredPrompt=e;});

  const baseProfile=profile;
  window.profile=function(){
    return baseProfile().replace('</div>',`<div class="section"><div class="title">Quick profile</div>
      <div class="small">Keep it simple: this app saves your data on this device.</div></div></div>`);
  };

  const baseRender=render;
  window.render=function(){
    baseRender();
    const w=document.getElementById("welcome");
    if(w) w.classList.toggle("hidden",!s.profile.welcome);
  };

  window.toast=function(t){
    let e=document.querySelector(".toast");
    if(!e){e=document.createElement("div");e.className="toast";document.body.appendChild(e);}
    e.textContent=t;e.classList.add("show");clearTimeout(window.__toast);
    window.__toast=setTimeout(()=>e.classList.remove("show"),2200);
  };
})();
