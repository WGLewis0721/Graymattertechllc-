const btn=document.querySelector('.menu-btn');
const closeMenu=()=>{document.body.classList.remove('menu-open');btn.setAttribute('aria-expanded','false')};
btn.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');btn.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('.mobile-panel a').forEach(a=>a.addEventListener('click',closeMenu));

document.querySelector('#contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(e.currentTarget);
  const subject=encodeURIComponent('ANR website inquiry — '+(d.get('topic')||'General'));
  const body=encodeURIComponent(`Name: ${d.get('name')||''}\nEmail: ${d.get('email')||''}\nOrganization: ${d.get('organization')||''}\nPhone: ${d.get('phone')||''}\nTopic: ${d.get('topic')||''}\n\n${d.get('message')||''}`);
  window.location.href=`mailto:bd@aknorthstar.com?subject=${subject}&body=${body}`;
});

const sections=[...document.querySelectorAll('main section[id]')];
const navs=[...document.querySelectorAll('.nav-links a[href^="#"]')];
const obs=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>obs.observe(s));
document.querySelector('#year').textContent=new Date().getFullYear();