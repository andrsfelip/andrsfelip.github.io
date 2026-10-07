const main=document.querySelector('main');
const home=main.innerHTML;
const quote=(text,author,url)=>`<figure class="section-quote"><blockquote>${text}</blockquote><figcaption><a href="${url}" target="_blank" rel="noopener noreferrer">${author}</a></figcaption></figure>`;
const playlists=[{"title": "El solar de Andrés", "url": "https://music.apple.com/us/playlist/el-solar-de-andr%C3%A9s/pl.u-AkAm82mCxejZd7", "embed": "https://embed.music.apple.com/us/playlist/el-solar-de-andr%C3%A9s/pl.u-AkAm82mCxejZd7?theme=dark", "label": "Clave"}, {"title": "Reggaetón", "url": "https://music.apple.com/us/playlist/reggaet%C3%B3n/pl.u-vxy6kpBIW3vpq1", "embed": "https://embed.music.apple.com/us/playlist/reggaet%C3%B3n/pl.u-vxy6kpBIW3vpq1?theme=dark", "label": "After Hours"}, {"title": "Jazz", "url": "https://music.apple.com/us/playlist/jazz/pl.u-AkAm8vNCxejZd7", "embed": "https://embed.music.apple.com/us/playlist/jazz/pl.u-AkAm8vNCxejZd7?theme=dark", "label": "Blue Notes"}, {"title": "Chill", "url": "https://music.apple.com/us/playlist/chill/pl.u-BNA6YjJTeb6Ndp", "embed": "https://embed.music.apple.com/us/playlist/chill/pl.u-BNA6YjJTeb6Ndp?theme=dark", "label": "Slow Drift"}, {"title": "Her", "label": "Dear You", "url": "https://music.apple.com/us/playlist/her/pl.u-leylMxLCMGdDKx", "embed": "https://embed.music.apple.com/us/playlist/her/pl.u-leylMxLCMGdDKx?theme=dark"}];
function musicContent(){return playlists.map(p=>`<details class="row playlist"><summary class="row-head"><h2>${p.label}</h2><span class="expand" aria-hidden="true">+</span></summary><div class="playlist-player"><iframe title="${p.title} on Apple Music" src="${p.embed}" height="450" loading="lazy" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"></iframe><a class="apple-link" href="${p.url}" target="_blank" rel="noopener noreferrer">Open in Apple Music</a></div></details>`).join('')}
function studyDeck(id,deck){return `<details class="study-deck" data-deck="${id}" aria-label="${deck.title} flashcards"><summary class="deck-heading"><h3>${deck.title}</h3><span class="deck-count">${deck.cards.length.toLocaleString('en-US')} cards</span><span class="expand" aria-hidden="true">+</span></summary><div class="deck-body"><div class="flashcard" tabindex="0" aria-label="Flashcard. Press Space to reveal the answer."><span class="card-side">Question</span><p class="card-question"></p><div class="card-answer" hidden><span class="card-side">Answer</span><p></p></div></div><div class="study-controls"><button type="button" data-study="previous">Previous</button><button type="button" data-study="reveal" class="study-primary" aria-expanded="false">Show answer</button><button type="button" data-study="next">Next</button></div><div class="study-footer"><span class="card-progress" role="status" aria-live="polite"></span><button type="button" data-study="shuffle">Shuffle</button></div></div></details>`}
function licensingContent(){return `<details class="row licensing"><summary><div class="row-head"><h2>Securities Licensing</h2><span class="expand" aria-hidden="true">+</span></div><p>Markets, rules, and the judgment behind them.</p><small>SIE · Series 63</small></summary><div class="study-area">${Object.entries(window.STUDY_DECKS).map(([id,deck])=>studyDeck(id,deck)).join('')}</div></details>`}
const deckSessions={};
function setupStudy(){document.querySelectorAll('[data-deck]').forEach(root=>{const id=root.dataset.deck,deck=window.STUDY_DECKS?.[id];if(!deck?.cards?.length)return;const state=deckSessions[id]??(deckSessions[id]={order:deck.cards.map((_,i)=>i),index:0,revealed:false});const answer=root.querySelector('.card-answer'),reveal=root.querySelector('[data-study="reveal"]');function render(){const card=deck.cards[state.order[state.index]];root.querySelector('.card-question').textContent=card.question;answer.querySelector('p').textContent=card.answer;answer.hidden=!state.revealed;reveal.textContent=state.revealed?'Hide answer':'Show answer';reveal.setAttribute('aria-expanded',String(state.revealed));root.querySelector('.card-progress').textContent=`Card ${state.index+1} of ${state.order.length.toLocaleString('en-US')}`;root.querySelector('[data-study="previous"]').disabled=state.index===0;root.querySelector('[data-study="next"]').textContent=state.index===state.order.length-1?'Start again':'Next';}function action(kind){if(kind==='reveal')state.revealed=!state.revealed;else{if(kind==='previous')state.index=Math.max(0,state.index-1);if(kind==='next')state.index=(state.index+1)%state.order.length;if(kind==='shuffle'){for(let i=state.order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.order[i],state.order[j]]=[state.order[j],state.order[i]]}state.index=0;}state.revealed=false;}render()}root.querySelectorAll('[data-study]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.study)));root.querySelector('.flashcard').addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();action('reveal')}if(e.key==='ArrowRight'){e.preventDefault();action('next')}if(e.key==='ArrowLeft'){e.preventDefault();action('previous')}});render()})}
// Keep a compact reading context above the scrolling document.
const readingBar=document.querySelector('.reading-bar');
const readingPage=readingBar.querySelector('.reading-page');
const readingSection=readingBar.querySelector('.reading-section');
let readingFrame=0;
function updateReadingContext(){
 readingFrame=0;
 const heading=main.querySelector('.view>h1');
 if(document.body.dataset.page==='home'||!heading){readingBar.style.setProperty('--reading-progress',0);readingPage.textContent='';readingSection.textContent='';readingBar.classList.remove('has-subtitle');return}
 // Finish the fade at full contrast even when scrolling stops.
 const bottom=heading.getBoundingClientRect().bottom;
 const progress=bottom<120?1:0;
 readingBar.style.setProperty('--reading-progress',progress.toFixed(3));
 readingPage.textContent=heading.textContent;
 heading.style.opacity=String(1-progress);
 const boundary=readingBar.getBoundingClientRect().bottom;
 let active=null;
 for(const row of main.querySelectorAll('.list>.row')){
  const title=row.querySelector('h2');
  if(title&&title.getBoundingClientRect().top<=boundary)active=title;
 }
 // Only a heading crossing the top reading boundary can change the label.
 const label=active?.textContent||'';
 readingBar.classList.toggle('has-subtitle',Boolean(label));
 if(readingSection.textContent!==label){
  readingSection.getAnimations().forEach(animation=>animation.cancel());
  readingSection.textContent=label;
  if(label&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
   readingSection.animate([{opacity:0},{opacity:1}],{duration:500,easing:'ease-out'});
 }
}
function scheduleReadingContext(){if(!readingFrame)readingFrame=requestAnimationFrame(updateReadingContext)}
window.addEventListener('scroll',scheduleReadingContext,{passive:true});
window.addEventListener('resize',scheduleReadingContext);
new ResizeObserver(scheduleReadingContext).observe(main);
main.addEventListener('toggle',scheduleReadingContext,true);
function setupAccordions(){
 main.querySelectorAll('details').forEach(details=>{
  const summary=details.querySelector(':scope > summary');
  if(!summary)return;
  let animation=null,targetOpen=details.open;
  summary.addEventListener('click',event=>{
   if(event.target.closest('a,button,input'))return;
   event.preventDefault();
   targetOpen=!targetOpen;
   const from=details.getBoundingClientRect().height;
   if(animation){animation.cancel();animation=null;}
   details.style.height='';details.style.overflow='';
   if(matchMedia('(prefers-reduced-motion: reduce)').matches){details.open=targetOpen;return;}
   // Measure the natural destination, keeping content rendered during closure.
   details.open=targetOpen;
   const to=details.getBoundingClientRect().height;
   details.open=true;
   details.style.overflow='hidden';
   animation=details.animate([{height:from+'px'},{height:to+'px'}],{
    duration:320,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'
   });
   const current=animation;
   current.onfinish=()=>{
    if(animation!==current)return;
    details.open=targetOpen;
    current.cancel();animation=null;
    details.style.height='';details.style.overflow='';
    scheduleReadingContext();
   };
  });
 });
}
const views={home,
music:`<section class="view"><h1>Music</h1>${quote('“All art constantly aspires towards the condition of music.”','Walter Pater · The School of Giorgione','https://www.gutenberg.org/cache/epub/2398/pg2398-images.html')}<div class="list music-list">${musicContent()}</div></section>`,
projects:`<section class="view"><h1>Projects</h1>${quote('“Theories thus become instruments, not answers to enigmas, in which we can rest.”','William James · Pragmatism','https://www.gutenberg.org/files/5116/5116-h/5116-h.htm')}<div class="list"><details class="row"><summary><div class="row-head"><h2>Yield Curve Regimes</h2><span class="expand" aria-hidden="true">+</span></div><p>Trading and risk across interest-rate regimes.</p><small>Fixed Income · C++ · Markov Models</small></summary><div class="detail"><h3>Regime-Aware Yield Curve Trading and Risk Analysis in C++</h3><h3>Research question</h3><p>How do the risk and performance of DV01-neutral U.S. Treasury yield-curve trades vary across interest-rate regimes?</p><h3>Scope</h3><p>Treasury pricing, duration, convexity and DV01 form the analytical core. The research examines steepener and flattener trades across regimes identified with a Markov-switching model.</p><p>Historical analysis and backtesting address look-ahead bias, risk attribution and the distinction between statistical relationships and tradable signals.</p></div></details>${licensingContent()}</div></section>`,
school:`<section class="view"><h1>School</h1>${quote('“To know how to criticize is good, to know how to create is better.”','Henri Poincaré · Science and Method','https://www.gutenberg.org/cache/epub/39713/pg39713-images.html')}<div class="list"><section class="row"><h2>MTH 4300</h2><p>Programming II</p></section><section class="row"><h2>MTH 4010</h2><p>Real Analysis</p></section></div></section>`,
writing:`<section class="view"><h1>Writing</h1>${quote('“I do not paint its being, I paint its passage.”','Michel de Montaigne · Of Repentance','https://www.gutenberg.org/files/3600/3600-h/3600-h.htm')}<div class="list"><section class="row"><h2>Moving to NY</h2></section></div></section>`,
books:`<section class="view"><h1>Books</h1>${quote('“How many a man has dated a new era in his life from the reading of a book.”','Henry David Thoreau · Walden','https://www.gutenberg.org/files/205/205-h/205-h.htm')}<div class="list"><section class="row"><h2>Against the Gods</h2><p>The Remarkable Story of Risk</p><small>Peter L. Bernstein</small></section></div></section>`};
function route(){const key=location.hash.slice(1)||'home',aliases={proyectos:'projects',escuela:'school',yo:'writing',libros:'books'};const resolved=aliases[key]||key,page=Object.hasOwn(views,resolved)?resolved:'home';main.innerHTML=views[page];setupStudy();setupAccordions();document.body.dataset.page=page;document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.title='Andrés Felipe — '+({home:'Home',projects:'Projects',school:'School',writing:'Writing',books:'Books',music:'Music'}[page]);window.scrollTo(0,0);updateReadingContext()}
window.addEventListener('hashchange',()=>{route();main.focus({preventScroll:true})});route();
const toggle=document.getElementById('menu-toggle'),menu=document.getElementById('site-menu');
function setMenu(open){if(open)drawMenu(false);document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');menu.inert=!open;menu.setAttribute('aria-hidden',String(!open));main.inert=open;document.getElementById('motion').inert=open;if(open)menu.querySelector('a').focus();else toggle.focus();}
toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
menu.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{setMenu(false);main.focus({preventScroll:true})}));
document.addEventListener('keydown',e=>{if(toggle.getAttribute('aria-expanded')!=='true')return;if(e.key==='Escape'){setMenu(false);return}if(e.key==='Tab'){const links=[toggle,...menu.querySelectorAll('a')];const first=links[0],last=links[links.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
const canvas=document.getElementById('particles'),ctx=canvas.getContext('2d'),button=document.getElementById('motion');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,width=0,height=0,request=0,last=0,time=0;
// A broad flowing particle ribbon, with independent depth and soft blue highlights.
let seed=8317;function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}
const dots=Array.from({length:16000},()=>({u:random(),v:(random()+random()+random()-1.5),depth:random(),phase:random()*Math.PI*2,bright:random(),size:.35+random()*.75}));

const menuCanvas=document.getElementById('menu-particles'),menuCtx=menuCanvas.getContext('2d');
// Small random displacements return toward a calm ribbon (mean-reverting diffusion).
const menuDots=Array.from({length:900},()=>({u:random(),v:(random()+random()+random()-1.5),x:0,y:0,phase:random()*Math.PI*2,light:random()}));
function drawMenu(advance){menuCtx.clearRect(0,0,width,height);for(const p of menuDots){if(advance){p.x+=-.006*p.x+(Math.random()-.5)*.0015;p.y+=-.006*p.y+(Math.random()-.5)*.0015;}const x=(.24+p.u*.85+p.x)*width,y=(.72-.23*p.u+Math.sin(p.u*7)*.07+p.v*.08+p.y)*height;const alpha=(.12+p.light*.30)*Math.min(1,p.u*2);menuCtx.fillStyle=`rgba(155,217,255,${alpha})`;const size=.6+p.light;menuCtx.fillRect(x,y,size,size);}}

function draw(){if(document.body.classList.contains('menu-open'))drawMenu(!paused);ctx.clearRect(0,0,width,height);const t=time*.00014;const mobile=width<680;const quantity=mobile?9500:dots.length;for(let i=0;i<quantity;i++){const p=dots[i],u=(p.u+t*.015)%1;const x=(u*1.2-.1)*width;const crest=Math.sin(u*6.6+t*.45)*.095+Math.sin(u*11.5-t*.24)*.035;const center=.77+crest-.28*u;const spread=(.035+.045*(.5+.5*Math.sin(u*8-t*.25)))*(mobile?1.25:1);const y=(center+p.v*spread+Math.sin(p.phase+t*.55)*.006)*height;const a=(.14+p.depth*.4)*(.78+.22*Math.sin(t+p.phase));ctx.fillStyle=p.bright>.80?'rgba(177,228,255,'+Math.min(.85,a*1.45)+')':'rgba(105,182,239,'+a+')';const r=p.size*(.6+p.depth*.65);ctx.fillRect(x,y,r,r);if(p.bright>.993){const glow=ctx.createRadialGradient(x,y,0,x,y,4);glow.addColorStop(0,'rgba(205,243,255,.65)');glow.addColorStop(.25,'rgba(143,215,255,.25)');glow.addColorStop(1,'rgba(108,195,255,0)');ctx.fillStyle=glow;ctx.fillRect(x-4,y-4,8,8)}}}
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;menuCanvas.width=width*dpr;menuCanvas.height=height*dpr;menuCtx.setTransform(dpr,0,0,dpr,0,0);drawMenu(false);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function tick(now){request=0;if(paused||document.hidden)return;if(now-last>32){time+=Math.min(now-last,60);last=now;draw()}request=requestAnimationFrame(tick)}
function start(){if(!request&&!paused&&!document.hidden){last=performance.now();request=requestAnimationFrame(tick)}}
function label(){button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Resume motion':'Pause motion');button.innerHTML='<span aria-hidden="true">'+(paused?'▷':'Ⅱ')+'</span><span class="motion-label">'+(paused?'Resume motion':'Pause motion')+'</span>'}
function stop(){cancelAnimationFrame(request);request=0}
button.addEventListener('click',()=>{paused=!paused;label();paused?stop():start()});reduced.addEventListener('change',e=>{paused=e.matches;label();paused?stop():start()});document.addEventListener('visibilitychange',()=>document.hidden?stop():start());window.addEventListener('resize',resize);resize();label();start();
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();main.focus()});
