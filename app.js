// 高频词句 - 核心交互逻辑 (app.js)
// 自动补全序号（若新增词条未写 id，会自动按顺序编号）
W.forEach((o, i) => { if (!o.id) o.id = i + 1; });
const defaultRanges = () => {
  const n = W.length, s1 = Math.ceil(n / 3), s2 = Math.ceil(n * 2 / 3);
  return [[1, s1], [s1 + 1, s2], [s2 + 1, n]];
};
const $=s=>document.querySelector(s);
const KEY='vocab-high-freq-v1';
let st={cur:1,star:{},done:{},nog:false,auto:false,shuf:false,showAns:false,size:1,theme:'auto',filter:'all',ranges:defaultRanges()};
try{Object.assign(st,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
if(!Array.isArray(st.ranges)||st.ranges.length!==3)st.ranges=defaultRanges();
st.ranges=st.ranges.map(r=>Array.isArray(r)&&r.length===2?r:[1,W.length]);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let tipT;
function showTip(el,ms){
  const tp=$('#tip');tp.textContent=el.dataset.tip;tp.classList.add('on');
  const r=el.getBoundingClientRect(),w=tp.offsetWidth,h=tp.offsetHeight;
  tp.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';
  tp.style.top=(r.top-h-6<4?r.bottom+6:r.top-h-6)+'px';
  clearTimeout(tipT);if(ms)tipT=setTimeout(hideTip,ms);
}
const hideTip=()=>$('#tip').classList.remove('on');
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1400)}

const pass=w=>st.filter==='all'||(st.filter==='star'&&st.star[w.id])||(st.filter==='todo'&&!st.done[w.id])||(st.filter==='done'&&st.done[w.id]);
const list=()=>W.filter(pass);

const IRR={be:'am|is|are|was|were|been|being',have:'has|had|having',do:'does|did|done|doing',go:'goes|going|went|gone',say:'said',get:'got|gotten',make:'made',know:'knew|known',take:'took|taken',see:'saw|seen',come:'came',give:'gave|given',find:'found',think:'thought',tell:'told',leave:'left',feel:'felt',bring:'brought',begin:'began|begun',keep:'kept',hold:'held',write:'wrote|written',stand:'stood',hear:'heard',mean:'meant',meet:'met',run:'ran',pay:'paid',sit:'sat',speak:'spoke|spoken',grow:'grew|grown',lose:'lost',spend:'spent',win:'won',foot:'feet',buy:'bought',send:'sent',build:'built',fall:'fell|fallen',drive:'drove|driven',break:'broke|broken',wear:'wore|worn',teach:'taught',sing:'sang|sung',swim:'swam|swum',draw:'drew|drawn',choose:'chose|chosen',lead:'led',throw:'threw|thrown',man:'men',woman:'women',child:'children',
i:'me|my|mine|myself',he:'him|his|himself',she:'her|hers|herself',we:'us|our|ours|ourselves',they:'them|their|theirs',you:'your|yours|yourself',it:'its|itself',this:'these',that:'those',a:'an',become:'became'};
function variants(b){
  const a=[b];
  if(b.length>=3){
    ['s','es','ed','d','ing','er','ers','est','ly'].forEach(x=>a.push(b+x));
    if(/e$/.test(b))['ing','ed','er','ers','est'].forEach(x=>a.push(b.slice(0,-1)+x));
    if(/[^aeiou]y$/.test(b))['ies','ied','ier','iest','ily'].forEach(x=>a.push(b.slice(0,-1)+x));
    if(/[^aeiou][aeiou][^aeiouwxy]$/.test(b))['ing','ed','er','ers','est','y'].forEach(x=>a.push(b+b.slice(-1)+x));
  }
  if(IRR[b])a.push(...IRR[b].split('|'));
  return a;
}
const baseOf=w=>w.split(/[\s\/]/)[0].toLowerCase().replace(/[^a-z'’-]/g,'');
const FORM={};let NT=0;
W.forEach(o=>{if(/n['’]t/i.test(o.w)){NT=o.id;return}const b=baseOf(o.w);if(/^[a-z]+$/.test(b))variants(b).forEach(v=>{if(!(v in FORM))FORM[v]=o.id})});
W.forEach(o=>{const b=baseOf(o.w);if(/^[a-z]+$/.test(b))FORM[b]=o.id});
const vcache={};
const vset=w=>vcache[w]||(vcache[w]=new Set(variants(baseOf(w))));
const TOK=/[A-Za-z]+(?:['’][A-Za-z]+)*/g;
const GL=/(\([^()]*[\u4e00-\u9fff][^()]*\))/;
function tipOf(tok){
  const lo=tok.toLowerCase();let id=FORM[lo],base=lo;
  if(id===undefined&&/['’]/.test(lo)){
    if(/n['’]t$/.test(lo)){
      let s=lo.slice(0,-3);if(s==='ca')s='can';else if(s==='wo')s='will';
      const a=FORM[s];if(a===undefined)return null;
      return W[a-1].w+' '+a+(NT?" · n't "+NT:"");
    }
    base=lo.split(/['’]/)[0];id=FORM[base];
  }
  if(id===undefined)return null;
  return W[id-1].w.toLowerCase()===base?String(id):id+' · '+W[id-1].w;
}
function hl(s,word){
  const set=vset(word),nt=/n['’]t/i.test(word),parts=s.split(GL);
  return parts.map((p,i)=>{
    if(i%2)return '<span class="g">'+esc(p)+'</span>';
    const toks=[...p.matchAll(TOK)],glossNext=i+1<parts.length;
    let out='',last=0;
    toks.forEach((m,k)=>{
      const tok=m[0],lo=tok.toLowerCase();
      out+=esc(p.slice(last,m.index));last=m.index+tok.length;
      const glossed=glossNext&&k===toks.length-1&&!p.slice(last).trim();
      const tip=glossed?null:tipOf(tok);
      let h=esc(tok);
      if(tip)h='<span class="t" data-tip="'+esc(tip)+'">'+h+'</span>';
      if(nt&&/n['’]t$/.test(lo)){
        const cut=tok.length-3;
        h=esc(tok.slice(0,cut))+'<mark>'+esc(tok.slice(cut))+'</mark>';
        if(tip)h='<span class="t" data-tip="'+esc(tip)+'">'+h+'</span>';
      }else if(set.has(lo)||set.has(lo.split(/['’]/)[0]))h='<mark>'+h+'</mark>';
      out+=h;
    });
    return out+esc(p.slice(last));
  }).join('');
}
const plain=s=>s.replace(/\([^()]*[\u4e00-\u9fff][^()]*\)/g,'').replace(/\s+/g,' ').trim();

function speak(t){
  if(!('speechSynthesis' in window))return toast('此浏览器不支持朗读');
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.9;speechSynthesis.speak(u);
}
let shown=false;
const cur=()=>W[st.cur-1];
const speakWord=()=>speak(cur().w.replace(/\/.*/,''));

function render(){
  hideTip();
  const it=cur(),L=list(),k=L.findIndex(x=>x.id===it.id);
  $('#card').innerHTML=
   '<div class="acts"><button class="s'+(st.star[it.id]?' on s':'')+'" data-a="star">'+(st.star[it.id]?'★ 已收藏':'☆ 收藏')+'</button>'+
   '<button data-a="done" class="'+(st.done[it.id]?'on':'')+'">'+(st.done[it.id]?'✓ 已掌握':'标记已掌握')+'</button>'+
   '<button data-a="gloss">'+(st.nog?'显示中文':'隐藏中文')+'</button></div>'+
   '<div class="hd"><h1 class="w" data-a="say" role="button" tabindex="0" title="点击朗读">'+esc(it.w)+'</h1><span class="ph">'+esc(it.p)+'</span></div>'+
   '<div class="ans">'+(shown
     ?'<ul class="mean">'+it.m.map(s=>'<li><b>'+esc(s[0])+'</b><span>'+esc(s[1])+'</span></li>').join('')+'</ul><button class="ansbtn hide" data-a="ans">隐藏答案</button>'
     :'<button class="ansbtn" data-a="ans">查看中文</button>')+'</div>'+
   '<ol class="ex">'+it.e.map((e,i)=>'<li data-i="'+i+'"><i>'+(i+1)+'</i><span>'+hl(e,it.w)+'</span></li>').join('')+'</ol>';
  $('#posN').textContent=it.id;
  $('#posT').textContent=' / '+W.length+(st.filter!=='all'&&k>=0?'　（筛选内 '+(k+1)+'/'+L.length+'）':'');
  $('#bar').style.width=(it.id/W.length*100)+'%';
  document.title=it.w+' · 高频词句';
  document.body.classList.toggle('nog',st.nog);
  updToc();
}
function go(id,say){
  id=Math.max(1,Math.min(W.length,id|0));st.cur=id;shown=st.showAns;save();
  try{history.replaceState(null,'','#'+id)}catch(e){}
  render();$('#main').scrollTop=0;
  if(say&&st.auto)speakWord();
}
function step(d){
  const L=list();if(!L.length)return toast('当前筛选下没有单词');
  if(st.shuf&&d>0)return rand();
  let i=L.findIndex(x=>x.id===st.cur);
  if(i<0){const j=d>0?L.findIndex(x=>x.id>st.cur):L.map(x=>x.id).reverse().findIndex(x=>x<st.cur);
    i=j<0?(d>0?0:L.length-1):(d>0?j:L.length-1-j);}
  else{i+=d;if(i>=L.length){i=0;toast('已到末尾，回到开头')}else if(i<0){i=L.length-1;toast('已到开头，跳到末尾')}}
  go(L[i].id,true);
}
function rand(){
  const base=list().filter(x=>x.id!==st.cur);
  const pools=st.ranges.map(([a,b])=>base.filter(x=>x.id>=a&&x.id<=b)).filter(x=>x.length);
  if(!pools.length)return toast('当前筛选和随机范围内没有其他单词');
  const pool=pools[Math.floor(Math.random()*pools.length)];
  go(pool[Math.floor(Math.random()*pool.length)].id,true);
}
function toggle(map,msg){
  const id=st.cur;if(map[id])delete map[id];else map[id]=1;save();render();
}

/* 目录 */
const tocEl=$('#toc');
tocEl.innerHTML=W.map(w=>'<button data-id="'+w.id+'"><span><em>'+w.id+'</em>'+esc(w.w)+'</span><b></b></button>').join('')+'<div class="none" hidden>没有匹配的单词</div>';
const FL=[['all','全部'],['star','收藏'],['todo','未掌握'],['done','已掌握']];
function updToc(){
  const q=$('#q').value.trim().toLowerCase();let n=0;
  const btns=tocEl.querySelectorAll('button');
  btns.forEach((b,i)=>{
    const w=W[i],ok=pass(w)&&(!q||String(w.id)===q||w.w.toLowerCase().includes(q)||w.m.some(s=>s[1].includes(q))||String(w.id).startsWith(q)&&/^\d+$/.test(q));
    b.hidden=!ok;if(ok)n++;
    b.classList.toggle('cur',w.id===st.cur);b.classList.toggle('d',!!st.done[w.id]);
    b.lastChild.textContent=(st.star[w.id]?'★':'')+(st.done[w.id]?'✓':'');
  });
  tocEl.querySelector('.none').hidden=n>0;
  const cnt={all:W.length,star:Object.keys(st.star).length,done:Object.keys(st.done).length};cnt.todo=W.length-cnt.done;
  $('#chips').innerHTML=FL.map(f=>'<button data-f="'+f[0]+'" class="'+(st.filter===f[0]?'on':'')+'">'+f[1]+' '+cnt[f[0]]+'</button>').join('');
}
function openDrawer(on){
  $('#drawer').classList.toggle('on',on);$('#mask').classList.toggle('on',on||$('#sheet').classList.contains('on'));
  if(on){const c=tocEl.querySelector('.cur');if(c)c.scrollIntoView({block:'center'})}
}
function openSheet(on){$('#sheet').classList.toggle('on',on);$('#mask').classList.toggle('on',on||$('#drawer').classList.contains('on'))}
function closeAll(){$('#drawer').classList.remove('on');$('#sheet').classList.remove('on');$('#mask').classList.remove('on')}

/* 事件 */
$('#card').addEventListener('mouseover',e=>{const x=e.target.closest('.t');if(x)showTip(x)});
$('#card').addEventListener('mouseout',e=>{if(e.target.closest('.t'))hideTip()});
$('#card').addEventListener('click',e=>{
  const li=e.target.closest('li');
  if(li){const x=e.target.closest('.t');if(x)showTip(x,1600);return speak(plain(cur().e[li.dataset.i]))}
  const a=e.target.closest('[data-a]');if(!a)return;
  ({ans:()=>{shown=!shown;render()},star:()=>toggle(st.star),done:()=>toggle(st.done),say:speakWord,gloss:()=>{st.nog=!st.nog;$('#oNog').checked=st.nog;save();render()}})[a.dataset.a]();
});
$('#card').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.w')){e.preventDefault();e.stopPropagation();speakWord()}});
tocEl.addEventListener('click',e=>{const b=e.target.closest('button');if(b){go(+b.dataset.id,true);closeAll()}});
$('#chips').addEventListener('click',e=>{const b=e.target.closest('button');if(b){st.filter=b.dataset.f;save();render()}});
$('#q').addEventListener('input',updToc);
$('#btnToc').onclick=()=>openDrawer(true);$('#btnSet').onclick=()=>openSheet(true);$('#mask').onclick=closeAll;
$('#prev').onclick=()=>step(-1);$('#next').onclick=()=>step(1);
function setRange(i){
  let a=parseInt($('#r'+i+'Min').value,10),b=parseInt($('#r'+i+'Max').value,10);
  if(!(a>=1))a=1;if(!(b>=1))b=W.length;
  a=Math.min(a,W.length);b=Math.min(b,W.length);
  if(a>b)[a,b]=[b,a];
  st.ranges[i-1]=[a,b];$('#r'+i+'Min').value=a;$('#r'+i+'Max').value=b;save();
}
[1,2,3].forEach(i=>{ $('#r'+i+'Min').onchange=()=>setRange(i);$('#r'+i+'Max').onchange=()=>setRange(i); });
$('#rAll').onclick=()=>{st.ranges=defaultRanges();[1,2,3].forEach(i=>{$('#r'+i+'Min').value=st.ranges[i-1][0];$('#r'+i+'Max').value=st.ranges[i-1][1]});save();toast('已恢复三个默认范围')};
$('#oNog').onchange=e=>{st.nog=e.target.checked;save();render()};
$('#oAns').onchange=e=>{st.showAns=e.target.checked;save()};
$('#oAuto').onchange=e=>{st.auto=e.target.checked;save()};
$('#oShuf').onchange=e=>{st.shuf=e.target.checked;save()};
$('#oSize').oninput=e=>{st.size=+e.target.value;document.documentElement.style.setProperty('--fs',st.size);save()};
$('#oTheme').onchange=e=>{st.theme=e.target.value;applyTheme();save()};
$('#oReset').onclick=()=>{if(confirm('确定清空所有收藏和已掌握记录？')){st.star={};st.done={};save();render();toast('已清空')}};
function applyTheme(){const r=document.documentElement;st.theme==='auto'?r.removeAttribute('data-theme'):r.setAttribute('data-theme',st.theme)}

document.addEventListener('keydown',e=>{
  if(e.target.matches('input,select')||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();
  if(k==='escape')closeAll();
  else if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1);
  else if(k==='s'||e.key===' '){e.preventDefault();speakWord()}
  else if(k==='a'||(e.key==='Enter'&&e.target===document.body)){e.preventDefault();shown=!shown;render()}
  else if(k==='f')toggle(st.star);else if(k==='m')toggle(st.done);
  else if(k==='h'){st.nog=!st.nog;$('#oNog').checked=st.nog;save();render()}
  else if(k==='r')rand();else if(k==='t'){e.preventDefault();openDrawer(!$('#drawer').classList.contains('on'))}
});
let sx=0,sy=0;const mn=$('#main');
mn.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
mn.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>60&&Math.abs(dy)<50)step(dx<0?1:-1)});

/* 初始化 */
(function(){
  const h=parseInt(location.hash.slice(1),10);
  if(h>=1&&h<=W.length)st.cur=h;
  if(!(st.cur>=1&&st.cur<=W.length))st.cur=1;
  $('#oNog').checked=st.nog;$('#oAuto').checked=st.auto;$('#oAns').checked=st.showAns;shown=st.showAns;$('#oShuf').checked=st.shuf;
  [1,2,3].forEach(i=>{$('#r'+i+'Min').value=st.ranges[i-1][0];$('#r'+i+'Max').value=st.ranges[i-1][1]});$('#oSize').value=st.size;$('#oTheme').value=st.theme;
  document.documentElement.style.setProperty('--fs',st.size);applyTheme();render();
})();
