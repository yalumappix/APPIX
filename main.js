/* APPIX — interactions. Vanilla JS, sans dépendance. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
// 1. Apparition au scroll (décalage en cascade)
const rv=$$('.rv');
if('IntersectionObserver' in window&&!rm){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
 rv.forEach((el,i)=>{el.style.setProperty('--dl',(i%3)*90+'ms');io.observe(el)})}else rv.forEach(el=>el.classList.add('in'));
// 2. Scroll : progression, parallaxe du hero, ligne de méthode (throttle rAF)
const bar=$('.progress'),st=$('.stage'),pl=$('.plist');let tk=false;
const onScroll=()=>{tk=false;const h=document.documentElement;bar.style.transform='scaleX('+h.scrollTop/(h.scrollHeight-h.clientHeight||1)+')';
 if(pl){const r=pl.getBoundingClientRect();pl.style.setProperty('--p',Math.min(1,Math.max(0,(innerHeight*.65-r.top)/r.height)))}
 if(st&&!rm&&scrollY<1200)st.style.setProperty('--py',scrollY*-.12+'px')};
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
// 3. Lien actif dans la navigation
if('IntersectionObserver' in window){const links=$$('.links a[href^="#"]:not(.btn)');
 const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.getAttribute('href')==='#'+e.target.id?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current'))}),{rootMargin:'-45% 0px -50% 0px'});
 links.forEach(a=>{const s=$(a.getAttribute('href'));s&&so.observe(s)})}
// 4. Menu mobile (clic, Échap, fermeture au choix d'un lien)
const mb=$('.menu'),nl=$('.links');
const setMenu=o=>{nl.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu')};
mb.addEventListener('click',()=>setMenu(!nl.classList.contains('open')));
$$('a',nl).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape'&&nl.classList.contains('open')){setMenu(false);mb.focus()}});
// 5. Filtres du portfolio
$$('.fl button').forEach(b=>b.addEventListener('click',()=>{$$('.fl button').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});b.classList.add('on');b.setAttribute('aria-pressed','true');
 $$('.proj').forEach(p=>p.hidden=b.dataset.f!=='all'&&p.dataset.c!==b.dataset.f)}));
// 6. FAQ animée
$$('.fq button').forEach(b=>b.addEventListener('click',()=>{const it=b.parentElement,o=it.classList.toggle('open');b.setAttribute('aria-expanded',o)}));
// 7. Parallaxe au pointeur (hero) + inclinaison des cartes + curseur : souris uniquement
if(fine&&!rm){
 $('.hero').addEventListener('pointermove',e=>{const r=st.getBoundingClientRect();st.style.setProperty('--mx',(e.clientX-r.left-r.width/2)/r.width);st.style.setProperty('--my',(e.clientY-r.top-r.height/2)/r.height)});
 $$('.proj').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*8+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*8+'deg')});
  c.addEventListener('pointerleave',()=>{c.style.setProperty('--ry','0deg');c.style.setProperty('--rx','0deg')})});
 const cur=document.createElement('div');cur.className='cur';cur.setAttribute('aria-hidden','true');document.body.append(cur);
 let x=0,y=0,cx=0,cy=0,run=false;
 const loop=()=>{cx+=(x-cx)*.18;cy+=(y-cy)*.18;cur.style.transform='translate('+cx+'px,'+cy+'px)';if(Math.abs(x-cx)>.1||Math.abs(y-cy)>.1)requestAnimationFrame(loop);else run=false};
 addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;cur.classList.add('on');if(!run){run=true;loop()}});
 document.addEventListener('pointerover',e=>cur.classList.toggle('hot',!!e.target.closest('a,button,.proj,.row')));
 document.documentElement.addEventListener('pointerleave',()=>cur.classList.remove('on'));
}
// 8. Formulaire mailto (n'envoie rien : ouvre la messagerie du visiteur)
const toast=$('.toast');
$('#cf').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget),n='\n';
 const body='Bonjour APPIX,'+n+n+'Nom : '+d.get('name')+n+'E-mail : '+d.get('email')+n+'Projet : '+d.get('type')+n+n+d.get('message');
 toast.textContent='Ouverture de votre application e-mail…';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4000);
 location.href='mailto:zumra-gokhan@outlook.fr?subject='+encodeURIComponent('Demande de projet — '+d.get('type'))+'&body='+encodeURIComponent(body)});
$('#year').textContent=new Date().getFullYear();
})();
