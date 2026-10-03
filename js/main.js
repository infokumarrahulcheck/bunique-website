const progress=document.querySelector('.scroll-progress');
const glow=document.querySelector('.cursor-glow');

window.addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(max>0?(scrollY/max)*100:0)+'%';
},{passive:true});

if(glow){
  window.addEventListener('pointermove',e=>{
    glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px';
  },{passive:true});
}

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('[data-count]').forEach(el=>{
  const target=Number(el.dataset.count);
  const counter=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting) return;
    let start=0; const duration=1200; const t0=performance.now();
    function tick(now){
      const p=Math.min(1,(now-t0)/duration);
      const eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*eased)+'+';
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick); counter.disconnect();
  });
  counter.observe(el);
});

document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('pointermove',e=>{
    if(window.innerWidth<800) return;
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-(r.left+r.width/2))*0.12;
    const y=(e.clientY-(r.top+r.height/2))*0.12;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener('pointerleave',()=>btn.style.transform='');
});

document.querySelectorAll('.service-card,.category-card,.trust-card,.insight').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(window.innerWidth<900) return;
    const r=card.getBoundingClientRect();
    const rx=((e.clientY-r.top)/r.height-.5)*-5;
    const ry=((e.clientX-r.left)/r.width-.5)*5;
    card.style.transform=`perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave',()=>card.style.transform='');
});
