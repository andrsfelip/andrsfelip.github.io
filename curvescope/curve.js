const canvas=document.querySelector('#surface'),ctx=canvas.getContext('2d');
const pauseButton=document.querySelector('#pause'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches,w=0,h=0,last=0,phase=0,light=document.documentElement.dataset.theme==='light'?1:0;
function resize(){w=canvas.clientWidth;h=canvas.clientHeight;if(!w||!h)return;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);draw();}
function color(alpha){const a=[150,212,255],b=[117,91,42];return `rgba(${a.map((v,i)=>Math.round(v+(b[i]-v)*light)).join(',')},${alpha})`;}
function point(t,j){const bend=1-Math.exp(-4*t);const shape=.33+.13*Math.sin(phase*.13+j*.065);const hump=.065*Math.sin(t*Math.PI*1.3+phase*.12);return [w*(.04+.92*t),h*(.71+j*.009-shape*bend-hump)];}
function draw(){if(!w||!h)return;ctx.clearRect(0,0,w,h);
 for(let j=0;j<17;j++){ctx.beginPath();for(let i=0;i<=130;i++){const p=point(i/130,j);i?ctx.lineTo(...p):ctx.moveTo(...p);}ctx.strokeStyle=color(j===8?.85:.12+(j/17)*.15);ctx.lineWidth=j===8?1.7:.8;ctx.stroke();}
 // Maturity guides make the motif recognizably a family of yield curves.
 [.03,.12,.26,.46,.72,.97].forEach((t,i)=>{const p=point(t,8);ctx.beginPath();ctx.arc(...p,2.5,0,Math.PI*2);ctx.fillStyle=color(.95);ctx.fill();ctx.font='9px ui-monospace,monospace';ctx.fillStyle=color(.7);ctx.fillText(['3M','2Y','5Y','10Y','20Y','30Y'][i],p[0]-7,p[1]+24);});
}
function updatePause(){pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Resume animation':'Pause animation');pauseButton.querySelector('.pause-symbol').textContent=paused?'▷':'Ⅱ';pauseButton.querySelector('.pause-label').textContent=paused?'Resume':'Pause';}
pauseButton.addEventListener('click',()=>{paused=!paused;updatePause();});reduced.addEventListener('change',e=>{if(e.matches){paused=true;updatePause();}});
function frame(now){const dt=Math.min((now-last)/1000||0,.04);last=now;if(!document.hidden){const target=document.documentElement.dataset.theme==='light'?1:0;light+=(target-light)*Math.min(1,dt*5);if(!paused)phase+=dt;if(!document.querySelector('#home').hidden)draw();else drawAmbient();}requestAnimationFrame(frame);}
const screens=[...document.querySelectorAll('.screen')];
function route(){let id=location.hash.slice(1)||'home';if(!screens.some(s=>s.id===id))id='home';screens.forEach(s=>s.hidden=s.id!==id);ambient.hidden=id==='home';window.scrollTo({top:0,behavior:'instant'});document.title='Curve Scope — '+({home:'Treasury Yield Curve Trading & Risk Analytics',explore:'Explore',overview:'Overview',basics:'Basics',implementation:'Implementation'}[id]);if(id==='home')resize();else document.querySelector('#'+id+' h2')?.focus({preventScroll:true});}
const ambient=document.querySelector('#ambient'),ambientCtx=ambient.getContext('2d');
let aw=0,ah=0;const motes=Array.from({length:65},(_,i)=>({x:((i*73)%101)/101,y:((i*47)%97)/97,r:.5+(i%4)*.3}));
function resizeAmbient(){aw=innerWidth;ah=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);ambient.width=aw*d;ambient.height=ah*d;ambientCtx.setTransform(d,0,0,d,0,0);}
function drawAmbient(){ambientCtx.clearRect(0,0,aw,ah);for(const p of motes){const x=(p.x*aw+Math.sin(phase*.08+p.y*7)*12),y=(p.y*ah+phase*1.5)%(ah+20);ambientCtx.beginPath();ambientCtx.arc(x,y,p.r,0,Math.PI*2);ambientCtx.fillStyle=color(.14);ambientCtx.fill();}}
resizeAmbient();window.addEventListener('resize',resizeAmbient);
document.addEventListener('click',e=>{if(document.querySelector('#explore').hidden||e.target.closest('a,button'))return;const r=document.querySelector('#explore').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.target===document.querySelector('#explore'))location.hash='home';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('#explore').hidden)location.hash='home';});
window.addEventListener('hashchange',route);window.addEventListener('resize',resize);route();updatePause();requestAnimationFrame(frame);
