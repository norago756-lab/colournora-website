const menu=document.querySelector('.menu'),nav=document.querySelector('.site-header nav');
menu.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(o))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const dialog=document.querySelector('.lightbox'),dimg=dialog.querySelector('img'),dtitle=dialog.querySelector('h3'),ddetails=dialog.querySelector('.caption p'),dstatus=dialog.querySelector('.caption span'),dinquiry=dialog.querySelector('.inquiry');
fetch('content.json').then(r=>r.json()).then(data=>{
 document.getElementById('about-text').textContent=data.about;
 document.getElementById('email-link').href=`mailto:${data.email}`;
 document.getElementById('instagram-link').href=data.instagram;
 const gallery=document.getElementById('gallery');
 data.works.forEach(work=>{
  const article=document.createElement('article'); article.className='work reveal';
  article.innerHTML=`<button aria-label="${work.title} vergrößern"><img src="${work.image}" alt="${work.title}" loading="lazy"></button><div class="work-meta"><div><h3>${work.title}</h3><p>${work.details}</p></div>${work.status?`<span>${work.status}</span>`:''}</div>`;
  gallery.appendChild(article); observer.observe(article);
  article.querySelector('button').addEventListener('click',()=>{dimg.src=work.image;dimg.alt=work.title;dtitle.textContent=work.title;ddetails.textContent=work.details;dstatus.textContent=work.status||'';dinquiry.href=`mailto:${data.email}?subject=${encodeURIComponent('Anfrage zu '+work.title)}`;dialog.showModal()});
 });
});
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
document.getElementById('year').textContent=new Date().getFullYear();