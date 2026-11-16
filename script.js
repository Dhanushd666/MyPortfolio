const root=document.documentElement;
const themeToggle=document.getElementById('themeToggle');
const savedTheme=localStorage.getItem('dhanush-theme');
if(savedTheme) root.dataset.theme=savedTheme;
themeToggle.addEventListener('click',()=>{
  const next=root.dataset.theme==='dark'?'light':'dark';
  root.dataset.theme=next; localStorage.setItem('dhanush-theme',next);
  themeToggle.textContent=next==='dark'?'☾':'☼';
});
themeToggle.textContent=root.dataset.theme==='dark'?'☾':'☼';

const menuToggle=document.querySelector('.menu-toggle');
const nav=document.getElementById('navLinks');
menuToggle.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.textContent=open?'×':'☰';
});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';
}));
document.getElementById('year').textContent=new Date().getFullYear();

// Touch-friendly certification carousel with responsive card widths.
const track=document.getElementById('certTrack');
const viewport=document.getElementById('certViewport');
const cards=[...track.children];
let certIndex=0,startX=0;
function visibleCards(){return window.innerWidth<=650?1:window.innerWidth<=900?2:3}
function maxIndex(){return Math.max(0,cards.length-visibleCards())}
function updateCarousel(){
  certIndex=Math.min(certIndex,maxIndex());
  const gap=15, cardWidth=cards[0].getBoundingClientRect().width;
  track.style.transform=`translateX(-${certIndex*(cardWidth+gap)}px)`;
  document.getElementById('certCount').textContent=`${String(certIndex+1).padStart(2,'0')} — ${String(Math.min(certIndex+visibleCards(),cards.length)).padStart(2,'0')} / 10`;
}
document.getElementById('certNext').addEventListener('click',()=>{certIndex=certIndex>=maxIndex()?0:certIndex+1;updateCarousel()});
document.getElementById('certPrev').addEventListener('click',()=>{certIndex=certIndex<=0?maxIndex():certIndex-1;updateCarousel()});
viewport.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
viewport.addEventListener('touchend',e=>{
  const delta=e.changedTouches[0].clientX-startX;
  if(Math.abs(delta)>45){certIndex=delta<0?Math.min(maxIndex(),certIndex+1):Math.max(0,certIndex-1);updateCarousel()}
},{passive:true});
window.addEventListener('resize',updateCarousel);
updateCarousel();
