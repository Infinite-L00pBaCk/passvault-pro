// ═══════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════
var USERS_KEY   = 'pv_users';     // array of {username, pwHash, pinHash, color}
var SESSION_KEY = 'pv_session';   // currently logged-in username
var vaultKey    = function(u){ return 'pv_vault_' + u; };

// ═══════════════════════════════════════
// APP STATE
// ═══════════════════════════════════════
var currentUser = null;
var entries     = [];
var curPass     = '';
var curTab      = 'random';
var delId       = null;
var search      = '';
var sort        = 'date-desc';
var cat         = 'all';
var ready       = false;
var pinBuf      = '';
var loginMethod = 'pw'; // 'pw' or 'pin'

// ═══════════════════════════════════════
// HASHING — simple hash stored as hex
// ═══════════════════════════════════════
async function sha256(str) {
  var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
}

// ═══════════════════════════════════════
// USER DB
// ═══════════════════════════════════════
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function findUser(username) {
  return getUsers().find(function(u){ return u.username.toLowerCase() === username.toLowerCase(); });
}

// ═══════════════════════════════════════
// LOGIN SCREEN UI
// ═══════════════════════════════════════
function swMode(m) {
  document.getElementById('tab-in').classList.toggle('on', m==='in');
  document.getElementById('tab-up').classList.toggle('on', m==='up');
  document.getElementById('formIn').style.display = m==='in' ? 'block' : 'none';
  document.getElementById('formUp').style.display = m==='up' ? 'block' : 'none';
  setMsg('');
}

function setMsg(msg, type) {
  var e = document.getElementById('lErr'), o = document.getElementById('lOk');
  e.classList.remove('on'); o.classList.remove('on');
  if (!msg) return;
  if (type === 'ok') { o.textContent = msg; o.classList.add('on'); }
  else { e.textContent = msg; e.classList.add('on'); }
}

function swLoginMethod() {
  loginMethod = loginMethod === 'pw' ? 'pin' : 'pw';
  document.getElementById('si-pw-section').style.display  = loginMethod === 'pw'  ? 'block' : 'none';
  document.getElementById('si-pin-section').style.display = loginMethod === 'pin' ? 'block' : 'none';
  pinBuf = ''; updatePinDots();
  setMsg('');
}

// ─── PIN keypad ───
function pinKey(k) {
  if (k === 'del') { pinBuf = pinBuf.slice(0, -1); }
  else if (k === 'ok') { if (pinBuf.length === 4) doPinLogin(); else setMsg('Enter all 4 digits.', 'err'); return; }
  else if (pinBuf.length < 4) { pinBuf += k; }
  updatePinDots();
  if (pinBuf.length === 4) setTimeout(doPinLogin, 120);
}
function updatePinDots() {
  for (var i = 0; i < 4; i++) {
    document.getElementById('pd' + i).classList.toggle('filled', i < pinBuf.length);
  }
}

// ═══════════════════════════════════════
// AUTH LOGIC
// ═══════════════════════════════════════
async function doCreate() {
  var uname = document.getElementById('suUser').value.trim();
  var pw    = document.getElementById('suPw').value;
  var pin   = document.getElementById('suPin').value.trim();
  if (!uname) { setMsg('Choose a username.', 'err'); return; }
  if (uname.length < 2) { setMsg('Username must be at least 2 characters.', 'err'); return; }
  if (!pw && !pin) { setMsg('Set at least a password or a PIN.', 'err'); return; }
  if (pw && pw.length < 4) { setMsg('Password must be at least 4 characters.', 'err'); return; }
  if (pin && !/^\d{4}$/.test(pin)) { setMsg('PIN must be exactly 4 digits.', 'err'); return; }
  if (findUser(uname)) { setMsg('Username already taken. Choose another.', 'err'); return; }

  var pwHash  = pw  ? await sha256('pw:'  + uname.toLowerCase() + ':' + pw)  : null;
  var pinHash = pin ? await sha256('pin:' + uname.toLowerCase() + ':' + pin) : null;

  var colors = ['#4285F4','#EA4335','#34A853','#FBBC05','#9C27B0','#00BCD4','#00f5a0','#ff6b6b','#c084fc'];
  var col = colors[getUsers().length % colors.length];

  var users = getUsers();
  users.push({ username: uname, pwHash: pwHash, pinHash: pinHash, color: col });
  saveUsers(users);

  setMsg('✅ Account created! Sign in now.', 'ok');
  document.getElementById('siUser').value = uname;
  swMode('in');
}

async function doLogin() {
  var uname = document.getElementById('siUser').value.trim();
  var pw    = document.getElementById('siPw').value;
  if (!uname) { setMsg('Enter your username.', 'err'); return; }
  if (!pw)    { setMsg('Enter your password.', 'err'); return; }

  var u = findUser(uname);
  if (!u) { setMsg('Account not found.', 'err'); return; }
  if (!u.pwHash) { setMsg('This account uses PIN only. Switch to PIN.', 'err'); return; }

  var hash = await sha256('pw:' + uname.toLowerCase() + ':' + pw);
  if (hash !== u.pwHash) { setMsg('Wrong password. Try again.', 'err'); return; }

  startSession(u);
}

async function doPinLogin() {
  var uname = document.getElementById('siUser').value.trim();
  if (!uname) { setMsg('Enter your username first.', 'err'); pinBuf=''; updatePinDots(); return; }
  if (pinBuf.length !== 4) { setMsg('Enter all 4 digits.', 'err'); return; }

  var u = findUser(uname);
  if (!u) { setMsg('Account not found.', 'err'); pinBuf=''; updatePinDots(); return; }
  if (!u.pinHash) { setMsg('This account has no PIN. Use password.', 'err'); pinBuf=''; updatePinDots(); return; }

  var hash = await sha256('pin:' + uname.toLowerCase() + ':' + pinBuf);
  pinBuf = ''; updatePinDots();
  if (hash !== u.pinHash) { setMsg('Wrong PIN. Try again.', 'err'); return; }

  startSession(u);
}

function startSession(u) {
  currentUser = u;
  localStorage.setItem(SESSION_KEY, u.username);
  // set chip
  document.getElementById('uph').textContent   = u.username[0].toUpperCase();
  document.getElementById('uph').style.background = u.color || '#4285F4';
  document.getElementById('uname').textContent = u.username;
  // show app
  document.getElementById('scrLogin').classList.add('off');
  document.getElementById('app').style.display = 'block';
  setMsg('');
  // clear inputs
  document.getElementById('siPw').value = '';
  pinBuf = ''; updatePinDots();
  if (!ready) { ready = true; initApp(); } else { entries = loadE(); renderAll(); }
  toast('👋 Welcome back, ' + u.username + '!', 'success');
}

function doSignOut() {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  entries = []; curPass = ''; ready = false; search = ''; sort = 'date-desc'; cat = 'all';
  pinBuf = ''; loginMethod = 'pw';
  // reset login form
  ['siUser','siPw'].forEach(function(id){ document.getElementById(id).value = ''; });
  document.getElementById('si-pw-section').style.display  = 'block';
  document.getElementById('si-pin-section').style.display = 'none';
  updatePinDots();
  swMode('in');
  setMsg('');
  // hide app, show login
  document.getElementById('app').style.display = 'none';
  document.getElementById('scrLogin').classList.remove('off');
  toast('👋 Signed out', 'info');
}

// ═══════════════════════════════════════
// STORAGE (per user)
// ═══════════════════════════════════════
function loadE()  { try { return JSON.parse(localStorage.getItem(vaultKey(currentUser.username))) || []; } catch { return []; } }
function saveE(e) { localStorage.setItem(vaultKey(currentUser.username), JSON.stringify(e)); }

// ═══════════════════════════════════════
// WORDLIST
// ═══════════════════════════════════════
var WL = ['apple','brave','cloud','dream','eagle','flame','grace','honey','ivory','jewel','kings','light','magic','noble','ocean','pearl','queen','river','storm','tiger','ultra','vault','water','xenon','youth','zebra','amber','blaze','crisp','delta','ember','frost','giant','heart','joker','karma','lunar','mango','night','orbit','piano','quark','robin','solar','titan','unity','vibes','wheat','yield','alpha','boost','coral','dance','elite','flair','gleam','haste','indie','jazzy','knack','lover','metro','nexus','onset','pride','quirk','reach','spark','trend','umbra','viola','whirl','arrow','beach','chess','earth','fauna','glass','house','image','juice','lemon','music','olive','quest','radio','sugar','table','urban','venus','world','yacht'];

// ═══════════════════════════════════════
// GENERATOR
// ═══════════════════════════════════════
function genRnd() {
  var len=+document.getElementById('lenSlider').value;
  var uc=document.getElementById('inclUpper').checked,lc=document.getElementById('inclLower').checked,nc=document.getElementById('inclNum').checked,sc=document.getElementById('inclSym').checked,xc=document.getElementById('exclAmb').checked;
  var UC=xc?'ABCDEFGHJKLMNPQRSTUVWXYZ':'ABCDEFGHIJKLMNOPQRSTUVWXYZ',LC=xc?'abcdefghjkmnpqrstuvwxyz':'abcdefghijklmnopqrstuvwxyz',NC=xc?'23456789':'0123456789',SC='!@#$%^&*()-_=+[]{}|;:,.<>?';
  var pool=''; if(uc)pool+=UC; if(lc)pool+=LC; if(nc)pool+=NC; if(sc)pool+=SC;
  if(!pool){toast('⚠️ Select at least one character type','error');return null;}
  var arr=new Uint32Array(len+8); crypto.getRandomValues(arr);
  var g=[];if(uc)g.push(UC[arr[0]%UC.length]);if(lc)g.push(LC[arr[1]%LC.length]);if(nc)g.push(NC[arr[2]%NC.length]);if(sc)g.push(SC[arr[3]%SC.length]);
  var p=g.join(''); for(var i=g.length;i<len;i++) p+=pool[arr[i+4]%pool.length];
  return p.split('').sort(function(){return Math.random()-.5}).join('');
}
function genPhrase() {
  var n=+document.getElementById('wCount').value,sep=document.getElementById('wSep').value,cs=document.getElementById('wCase').value,num=document.getElementById('ppNum').checked;
  var arr=new Uint32Array(n+1); crypto.getRandomValues(arr);
  var words=Array.from({length:n},function(_,i){var w=WL[arr[i]%WL.length];if(cs==='title')w=w[0].toUpperCase()+w.slice(1);if(cs==='upper')w=w.toUpperCase();return w;});
  return words.join(sep)+(num?sep+(arr[n]%90+10):'');
}
function strength(p) {
  if(!p)return{lv:0,lbl:'—',col:'var(--border)'};
  var s=0;if(p.length>=10)s++;if(p.length>=16)s++;if(p.length>=24)s++;if(/[A-Z]/.test(p))s++;if(/[a-z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;
  if(s<=2)return{lv:1,lbl:'WEAK',col:'#ff6b6b'};if(s<=3)return{lv:2,lbl:'FAIR',col:'#ffb347'};if(s<=5)return{lv:3,lbl:'GOOD',col:'#00c8ff'};
  return{lv:4,lbl:'STRONG',col:'#00f5a0'};
}

// ═══════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════
function updPass(p) {
  var el=document.getElementById('pTxt'),sr=document.getElementById('strRow');
  if(!p){el.textContent='Click "Generate" to create a password…';el.classList.add('empty');sr.style.display='none';return;}
  el.textContent=p;el.classList.remove('empty');
  var s=strength(p);sr.style.display='flex';
  ['sb1','sb2','sb3','sb4'].forEach(function(id,i){document.getElementById(id).style.background=i<s.lv?s.col:'var(--border)';});
  document.getElementById('strVal').textContent=s.lbl;document.getElementById('strVal').style.color=s.col;
}
function swTab(t) {
  curTab=t;
  ['random','phrase','manual'].forEach(function(x){
    document.getElementById('t-'+x).classList.toggle('on',x===t);
    document.getElementById('p-'+x).style.display=x===t?'block':'none';
  });
  curPass='';updPass('');
  var m=t==='manual';
  document.getElementById('refBtn').style.display=m?'none':'';
  document.getElementById('genBtn').textContent=m?'📋 Use This Password':'⚡ Generate';
  document.getElementById('genBtn').onclick=m?doManual:doGen;
}
function getPlat(){return document.getElementById(curTab==='random'?'rPlat':curTab==='phrase'?'phPlat':'mnPlat').value.trim();}
function getUser2(){return document.getElementById(curTab==='random'?'rUser':curTab==='phrase'?'phUser':'mnUser').value.trim();}
function getCat(){return document.getElementById(curTab==='random'?'rCat':curTab==='phrase'?'phCat':'mnCat').value;}
function getNotes(){return document.getElementById(curTab==='random'?'rNotes':curTab==='phrase'?'phNotes':'mnNotes').value.trim();}
function doGen(){var p=curTab==='phrase'?genPhrase():genRnd();if(!p)return;curPass=p;updPass(p);}
function doManual(){var p=document.getElementById('mnPw').value.trim();if(!p){toast('⚠️ Enter a password first','error');return;}curPass=p;updPass(p);}
function doSave() {
  var plat=getPlat();if(!plat){toast('⚠️ Enter a platform name','error');return;}
  if(!curPass){toast('⚠️ Generate a password first','error');return;}
  var e={id:Date.now(),platform:plat,username:getUser2(),icon:getCat(),password:curPass,notes:getNotes(),created:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),createdTs:Date.now()};
  entries.unshift(e);saveE(entries);renderAll();toast('🔒 "'+plat+'" saved!','success');
  ['rPlat','rUser','rNotes','phPlat','phUser','phNotes','mnPlat','mnUser','mnPw','mnNotes'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  curPass='';updPass('');
}

// ═══════════════════════════════════════
// RENDER
// ═══════════════════════════════════════
var DAY=864e5;
function age(ts){var d=Math.floor((Date.now()-ts)/DAY);if(d===0)return'Today';if(d===1)return'Yesterday';if(d<30)return d+'d ago';if(d<365)return Math.floor(d/30)+'mo ago';return Math.floor(d/365)+'y ago';}
function old(ts){return(Date.now()-ts)>90*DAY;}
function reusedSet(){var m={};entries.forEach(function(e){m[e.password]=(m[e.password]||0)+1;});return new Set(Object.keys(m).filter(function(p){return m[p]>1;}));}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function anim(id,target){var el=document.getElementById(id);var s=parseInt(el.textContent)||0;if(s===target){el.textContent=target;return;}var step=(target-s)/12;var cur=s;var t=setInterval(function(){cur+=step;if((step>0&&cur>=target)||(step<0&&cur<=target)){el.textContent=target;clearInterval(t);}else el.textContent=Math.round(cur);},30);}
function renderAll(){renderDash();renderFtabs();renderAlerts();renderVault();}
function renderDash(){
  var rs=reusedSet();
  anim('stTotal',entries.length);
  anim('stStrong',entries.filter(function(e){return strength(e.password).lv>=4;}).length);
  anim('stWeak',entries.filter(function(e){return strength(e.password).lv<=2;}).length);
  anim('stReused',entries.filter(function(e){return rs.has(e.password);}).length);
  document.getElementById('vcnt').textContent=entries.length+' password'+(entries.length!==1?'s':'');
}
function renderFtabs(){
  var cats=['all'].concat(Array.from(new Set(entries.map(function(e){return e.icon;}))));
  var nm={'all':'All','🌐':'Web','📧':'Email','💳':'Bank','🎮':'Gaming','📱':'Social','🛒':'Shop','💼':'Work','☁️':'Cloud','🔧':'Dev','🎵':'Music','🏥':'Health','🔑':'Other'};
  document.getElementById('ftabs').innerHTML=cats.map(function(c){
    var cnt=c==='all'?entries.length:entries.filter(function(e){return e.icon===c;}).length;
    return '<button class="ftab'+(cat===c?' on':'')+ '" onclick="setF(\''+c+'\')">'+
      (c==='all'?'All ('+cnt+')':c+' '+(nm[c]||'')+'('+cnt+')')+'</button>';
  }).join('');
}
function setF(c){cat=c;renderFtabs();renderVault();}
function renderAlerts(){
  var rs=reusedSet();
  var wk=entries.filter(function(e){return strength(e.password).lv<=2;});
  var re=entries.filter(function(e){return rs.has(e.password);});
  var ol=entries.filter(function(e){return e.createdTs&&old(e.createdTs);});
  var h='';
  if(wk.length)h+='<div class="abar warn" onclick="openHealth()">⚠️ '+wk.length+' weak password'+(wk.length>1?'s need':'needs')+' attention</div>';
  if(re.length)h+='<div class="abar warn" onclick="openHealth()">♻️ '+re.length+' password'+(re.length>1?'s are':'is')+' reused</div>';
  if(ol.length)h+='<div class="abar info" onclick="openHealth()">🕐 '+ol.length+' password'+(ol.length>1?'s haven\'t':'hasn\'t')+' been updated in 90+ days</div>';
  document.getElementById('halerts').innerHTML=h;
}
function renderVault(){
  var rs=reusedSet();
  var list=entries.slice();
  if(cat!=='all')list=list.filter(function(e){return e.icon===cat;});
  var q=search.toLowerCase();if(q)list=list.filter(function(e){return e.platform.toLowerCase().includes(q)||(e.username&&e.username.toLowerCase().includes(q));});
  list.sort(function(a,b){
    if(sort==='date-desc')return b.id-a.id;if(sort==='date-asc')return a.id-b.id;
    if(sort==='name-asc')return a.platform.localeCompare(b.platform);if(sort==='name-desc')return b.platform.localeCompare(a.platform);
    if(sort==='str-desc')return strength(b.password).lv-strength(a.password).lv;
    return strength(a.password).lv-strength(b.password).lv;
  });
  if(!list.length){
    document.getElementById('vlist').innerHTML='<div class="vempty"><div class="bi">🗝️</div><p>'+(entries.length===0?'Your vault is empty. Generate and save your first password!':'No results found.')+'</p></div>';
    return;
  }
  document.getElementById('vlist').innerHTML=list.map(function(e){
    var s=strength(e.password),ru=rs.has(e.password),ol=e.createdTs&&old(e.createdTs),bad=s.lv<=2||ru;
    return '<div class="ec'+(bad?' bad':ol?' warn':'')+'">'+
      '<div class="eic">'+e.icon+'</div>'+
      '<div class="ei">'+
        '<div class="etop"><div class="ep">'+esc(e.platform)+'</div>'+
        '<span class="badge '+s.lbl.toLowerCase()+'">'+s.lbl+'</span>'+
        (ru?'<span class="badge reused">♻ REUSED</span>':'')+
        (ol?'<span class="badge old">🕐 AGING</span>':'')+
        '</div>'+
        (e.username?'<div class="eu">👤 '+esc(e.username)+'</div>':'')+
        '<div class="emeta"><span class="etag">📅 '+(e.createdTs?age(e.createdTs):(e.created||''))+'</span></div>'+
        '<div class="epass" id="pw-'+e.id+'">••••••••••••</div>'+
        (e.notes?'<div class="enote" title="'+esc(e.notes)+'">📝 '+esc(e.notes)+'</div>':'')+
      '</div>'+
      '<div class="ea">'+
        '<button class="ibtn" onclick="togPw('+e.id+')">👁</button>'+
        '<button class="ibtn" onclick="cpPw('+e.id+')">📋</button>'+
        '<button class="ibtn" onclick="openEdit('+e.id+')">✏️</button>'+
        '<button class="ibtn del" onclick="askDel('+e.id+')">🗑</button>'+
      '</div></div>';
  }).join('');
}

// ═══════════════════════════════════════
// ENTRY ACTIONS
// ═══════════════════════════════════════
function togPw(id){var el=document.getElementById('pw-'+id),e=entries.find(function(x){return x.id===id;});if(el.classList.contains('rev')){el.textContent='••••••••••••';el.classList.remove('rev');}else{el.textContent=e.password;el.classList.add('rev');}}
function cpPw(id){var e=entries.find(function(x){return x.id===id;});navigator.clipboard.writeText(e.password).then(function(){toast('✅ "'+e.platform+'" copied!','success');});}
function askDel(id){delId=id;openM('mDel');}
document.getElementById('btnDel').addEventListener('click',function(){if(delId){entries=entries.filter(function(e){return e.id!==delId;});saveE(entries);renderAll();toast('🗑 Deleted','info');}closeM('mDel');delId=null;});
function openEdit(id){
  var e=entries.find(function(x){return x.id===id;});
  document.getElementById('eId').value=id;document.getElementById('ePlat').value=e.platform;
  document.getElementById('eUser').value=e.username||'';document.getElementById('ePw').value=e.password;
  document.getElementById('eCat').value=e.icon;document.getElementById('eNotes').value=e.notes||'';
  openM('mEdit');
}
function saveEdit(){
  var id=+document.getElementById('eId').value,idx=entries.findIndex(function(e){return e.id===id;});
  if(idx<0)return;
  entries[idx]=Object.assign({},entries[idx],{
    platform:document.getElementById('ePlat').value.trim()||entries[idx].platform,
    username:document.getElementById('eUser').value.trim(),
    password:document.getElementById('ePw').value.trim()||entries[idx].password,
    icon:document.getElementById('eCat').value,
    notes:document.getElementById('eNotes').value.trim()
  });
  saveE(entries);renderAll();closeM('mEdit');toast('✅ "'+entries[idx].platform+'" updated!','success');
}

// ═══════════════════════════════════════
// HEALTH
// ═══════════════════════════════════════
function openHealth(){
  var rs=reusedSet();
  var wk=entries.filter(function(e){return strength(e.password).lv<=2;});
  var re=entries.filter(function(e){return rs.has(e.password);});
  var ol=entries.filter(function(e){return e.createdTs&&old(e.createdTs);});
  var score=100;
  if(entries.length>0)score=Math.max(0,Math.round(100-(wk.length/entries.length)*50-(re.length/entries.length)*30-(ol.length/entries.length)*20));
  var sc=score>=80?'var(--accent)':score>=50?'var(--accent4)':'var(--accent3)';
  var sl=score>=80?'Excellent 🏆':score>=60?'Good 👍':score>=40?'Fair ⚠️':'Needs Work 🚨';
  function sec(title,items,rgb,icon){
    if(!items.length)return'<div style="padding:12px 16px;border-radius:10px;border:1px solid var(--border);margin-bottom:10px;color:var(--accent);font-size:13px">✅ '+title+': All good!</div>';
    return'<div style="padding:14px 16px;border-radius:10px;border:1px solid rgba('+rgb+',.3);background:rgba('+rgb+',.07);margin-bottom:10px">'+
      '<div style="font-size:11px;font-weight:700;letter-spacing:1px;margin-bottom:10px;color:rgba('+rgb+',1)">'+icon+' '+title.toUpperCase()+' ('+items.length+')</div>'+
      items.slice(0,6).map(function(e){return'<div style="font-size:12px;color:var(--muted2);padding:4px 0;border-bottom:1px solid var(--border)">'+e.icon+' '+esc(e.platform)+(e.username?' — '+esc(e.username):'')+'</div>';}).join('')+
      (items.length>6?'<div style="font-size:11px;color:var(--muted);margin-top:6px">+'+(items.length-6)+' more…</div>':'')+
      '</div>';
  }
  document.getElementById('hRpt').innerHTML=
    '<div style="text-align:center;margin-bottom:20px">'+
    '<div style="font-family:\'Space Mono\',monospace;font-size:56px;font-weight:700;color:'+sc+';line-height:1">'+score+'</div>'+
    '<div style="color:'+sc+';font-size:14px;font-weight:700;margin-top:4px">'+sl+'</div>'+
    '<div style="color:var(--muted2);font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-top:4px">Security Score</div>'+
    '</div>'+sec('Weak Passwords',wk,'255,107,107','⚠️')+sec('Reused Passwords',re,'255,107,107','♻️')+sec('Aging (90+ Days)',ol,'255,179,71','🕐');
  openM('mHealth');
}

// ═══════════════════════════════════════
// EXPORT / IMPORT
// ═══════════════════════════════════════
function openExport(){if(!entries.length){toast('⚠️ Vault is empty','error');return;}openM('mExp');}
function openImport(){openM('mImp');}
function dlBlob(blob,name){var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(url);document.body.removeChild(a);},300);}
function expJSON(){try{dlBlob(new Blob([JSON.stringify({app:'PassVault Pro',v:3,exported:new Date().toISOString(),entries:entries},null,2)],{type:'application/json;charset=utf-8'}),'passvault-'+Date.now()+'.json');setTimeout(function(){closeM('mExp');toast('📄 JSON downloaded!','success');},150);}catch(err){toast('❌ '+err.message,'error');}}
function expCSV(){try{var rows=entries.map(function(e){return[e.platform,e.username||'',e.password,e.icon,e.notes||'',e.created||''];});dlBlob(new Blob(['\uFEFF'+[['Platform','Username','Password','Category','Notes','Created']].concat(rows).map(function(r){return r.map(function(c){return'"'+String(c).replace(/"/g,'""')+'"';}).join(',');}).join('\r\n')],{type:'text/csv;charset=utf-8'}),'passvault-'+Date.now()+'.csv');setTimeout(function(){closeM('mExp');toast('📊 CSV downloaded!','success');},150);}catch(err){toast('❌ '+err.message,'error');}}
function doImport(file){
  if(!file)return;
  if(!file.name.endsWith('.json')&&file.type!=='application/json'){toast('⚠️ Select a .json file','error');return;}
  var r=new FileReader();
  r.onload=function(ev){
    try{
      var d=JSON.parse(ev.target.result),imp=Array.isArray(d)?d:(d.entries&&Array.isArray(d.entries)?d.entries:null);
      if(!imp)throw new Error('No valid entries found');
      var known=new Set(entries.map(function(e){return e.id;}));var added=0;
      imp.forEach(function(e){if(e&&e.platform&&e.password){if(!e.id)e.id=Date.now()+Math.random();if(!known.has(e.id)){entries.unshift(e);known.add(e.id);added++;}}});
      saveE(entries);renderAll();closeM('mImp');toast('✅ Imported '+added+' entr'+(added===1?'y':'ies')+'!','success');
    }catch(err){toast('❌ Import failed: '+err.message,'error');}
  };
  r.readAsText(file,'UTF-8');
}
document.getElementById('fInput').addEventListener('change',function(e){var f=e.target.files[0];if(f)doImport(f);e.target.value='';});
var iz=document.getElementById('iZone');
iz.addEventListener('dragover',function(e){e.preventDefault();iz.classList.add('dg');});
iz.addEventListener('dragleave',function(e){if(!iz.contains(e.relatedTarget))iz.classList.remove('dg');});
iz.addEventListener('drop',function(e){e.preventDefault();iz.classList.remove('dg');doImport(e.dataTransfer.files[0]);});

// ═══════════════════════════════════════
// MODALS + TOAST
// ═══════════════════════════════════════
function openM(id){document.getElementById(id).classList.add('open');}
function closeM(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.mo').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('open');});});
var toastT;
function toast(msg,type){if(type===undefined)type='success';var t=document.getElementById('toast');t.textContent=msg;t.className='toast '+type+' show';clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show');},3000);}

// ═══════════════════════════════════════
// APP INIT
// ═══════════════════════════════════════
function initApp(){
  entries=loadE();
  document.getElementById('lenSlider').addEventListener('input',function(e){document.getElementById('lenVal').textContent=e.target.value;if(curPass)doGen();});
  ['upper','lower','num','sym','amb'].forEach(function(k){
    var id=k==='amb'?'exclAmb':'incl'+k[0].toUpperCase()+k.slice(1);
    var cb=document.getElementById(id),pl=document.getElementById('pl-'+k);
    if(!cb||!pl)return;
    cb.addEventListener('change',function(){pl.classList.toggle('on',cb.checked);if(curPass&&curTab==='random')doGen();});
  });
  var ppn=document.getElementById('ppNum'),ppl=document.getElementById('pl-ppn');
  ppn.addEventListener('change',function(){ppl.classList.toggle('on',ppn.checked);if(curPass&&curTab==='phrase')doGen();});
  ['wCount','wSep','wCase'].forEach(function(id){document.getElementById(id).addEventListener('change',function(){if(curPass&&curTab==='phrase')doGen();});});
  document.getElementById('genBtn').addEventListener('click',doGen);
  document.getElementById('refBtn').addEventListener('click',doGen);
  document.getElementById('savBtn').addEventListener('click',doSave);
  document.getElementById('cpyBtn').addEventListener('click',function(){if(!curPass){toast('⚠️ Generate a password first','error');return;}navigator.clipboard.writeText(curPass).then(function(){toast('✅ Copied!','success');});});
  document.getElementById('srch').addEventListener('input',function(e){search=e.target.value;renderVault();});
  document.getElementById('srt').addEventListener('change',function(e){sort=e.target.value;renderVault();});
  document.getElementById('mnPw').addEventListener('input',function(e){curPass=e.target.value;updPass(e.target.value||'');});
  renderAll();
}

// Keyboard shortcuts on login
document.getElementById('siPw').addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();});
document.getElementById('siUser').addEventListener('keydown',function(e){if(e.key==='Enter'){if(loginMethod==='pw')document.getElementById('siPw').focus();}});

// ═══════════════════════════════════════
// BOOT — check saved session
// ═══════════════════════════════════════
(function boot(){
  var saved = localStorage.getItem(SESSION_KEY);
  if (saved) {
    var u = findUser(saved);
    if (u) { startSession(u); return; }
  }
  // show login
})();