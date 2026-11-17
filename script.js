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


/* =====================================================
   PLAYFUL MOTION — scroll reveals, welcome toast, bubbles
   ===================================================== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal sections and cards gently as they enter the screen.
  const revealSelectors = [
    '.section-heading', '.about-intro', '.about-photo', '.about-facts',
    '.journey-column', '.journey-item', '.education-card', '.education-note',
    '.service-card', '.project-card', '.additional-projects > div',
    '.publication-card', '.venture-card > div', '.cert-intro', '.cert-card',
    '.hobby-main', '.hobby-side', '.contact-card > div'
  ];
  const revealItems = [...document.querySelectorAll(revealSelectors.join(','))];

  revealItems.forEach((element) => {
    element.classList.add('motion-reveal');
    if (element.matches('.about-photo,.journey-column,.hobby-side')) {
      element.classList.add('motion-right');
    } else if (element.matches('.about-intro,.hobby-main')) {
      element.classList.add('motion-left');
    }
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach((element) => observer.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add('motion-visible'));
  }

  // Welcome popup: appears once per page visit and can be dismissed.
  const toast = document.getElementById('helloToast');
  if (toast && !reduceMotion) {
    const close = toast.querySelector('.toast-close');
    let toastTimer;
    window.addEventListener('load', () => {
      toastTimer = window.setTimeout(() => toast.classList.add('toast-show'), 1100);
      window.setTimeout(() => toast.classList.remove('toast-show'), 6500);
    }, { once: true });
    close?.addEventListener('click', () => {
      window.clearTimeout(toastTimer);
      toast.classList.remove('toast-show');
    });
  } else if (toast) {
    toast.remove();
  }

  // Add tiny sparkle feedback when a visitor clicks the main CTA buttons.
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('pointerdown', () => {
      button.classList.remove('button-pop');
      void button.offsetWidth;
      button.classList.add('button-pop');
    });
  });
})();

// Highlight the navigation item for the section currently in view.
(() => {
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const activate = id => links.forEach(a => {
    const on = a.getAttribute('href') === '#' + id;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting)
      .sort((a,b) => Math.abs(a.boundingClientRect.top - 145) - Math.abs(b.boundingClientRect.top - 145));
    if (visible[0]) activate(visible[0].target.id);
  }, { rootMargin: '-105px 0px -58% 0px', threshold: [0, .1, .25, .5] });
  sections.forEach(s => observer.observe(s));
  links.forEach(a => a.addEventListener('click', () => activate(a.getAttribute('href').slice(1))));
})();
// Full-page scroll progress
const progressBar = document.getElementById("scrollProgress");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = scrollHeight > 0
    ? scrollTop / scrollHeight
    : 0;

  progressBar.style.transform =
    `scaleX(${Math.min(progress, 1)})`;
}

window.addEventListener("scroll", updateScrollProgress, {
  passive: true
});

window.addEventListener("resize", updateScrollProgress);

updateScrollProgress();

// "What's Next" section: start its decorative motion only when it enters view.
(() => {
  const section = document.querySelector('#venture');
  if (!section) return;

  if (!('IntersectionObserver' in window)) {
    section.classList.add('venture-in-view');
    return;
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      section.classList.add('venture-in-view');
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(section);
})();


// Reveal the skills cards when the Skills section enters the viewport.
(() => {
  const section = document.querySelector('#skills');
  if (!section) return;
  if (!('IntersectionObserver' in window)) {
    section.classList.add('skills-visible');
    return;
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      section.classList.add('skills-visible');
      observer.disconnect();
    }
  }, { threshold: 0.16 });
  observer.observe(section);
})();
