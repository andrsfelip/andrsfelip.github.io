const themeButton=document.getElementById('theme-toggle');
let themeTimer;
function themeLabel(){const light=document.documentElement.dataset.theme==='light';const label=light?'Switch to dark mode':'Switch to light mode';themeButton.setAttribute('aria-label',label);themeButton.title=label;document.querySelector('meta[name="theme-color"]').content=light?'#f2f0ea':'#111213';}
themeLabel();
themeButton.addEventListener('click',()=>{
 const root=document.documentElement,theme=root.dataset.theme==='light'?'dark':'light';
 root.classList.add('theme-changing');root.dataset.theme=theme;
 try{localStorage.setItem('af-theme',theme)}catch(e){}
 themeLabel();window.dispatchEvent(new CustomEvent('themechange',{detail:theme}));
 clearTimeout(themeTimer);themeTimer=setTimeout(()=>root.classList.remove('theme-changing'),950);
});
