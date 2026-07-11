
const menu=document.querySelector('.menu-button');
const nav=document.querySelector('.site-header nav');
menu.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const dialog=document.querySelector('.art-dialog');
const dimg=dialog.querySelector('.dialog-layout>img');
const dtitle=dialog.querySelector('h3');
const dmedium=dialog.querySelector('.medium');
const dsize=dialog.querySelector('.size');
const dyear=dialog.querySelector('.year');
const dstatus=dialog.querySelector('.status');
const dstatusRow=dialog.querySelector('.status-row');
const dinquiry=dialog.querySelector('.inquiry');

function renderWorks(items,targetId){
  const target=document.getElementById(targetId);
  items.forEach(work=>{
    const article=document.createElement('article');
    article.className='work reveal';
    article.innerHTML=`
      <button aria-label="${work.title} öffnen">
        <img src="${work.image}" alt="${work.title}" loading="lazy">
      </button>
      <div class="work-meta">
        <div><h3>${work.title}</h3><p>${work.medium}</p></div>
        ${work.status?`<span>${work.status}</span>`:''}
      </div>`;
    target.appendChild(article);
    observer.observe(article);
    article.querySelector('button').addEventListener('click',()=>{
      dimg.src=work.image;
      dimg.alt=work.title;
      dtitle.textContent=work.title;
      dmedium.textContent=work.medium;
      dsize.textContent=work.size;
      dyear.textContent=work.year;
      dstatus.textContent=work.status||'Available on request';
      dstatusRow.style.display='grid';
      dinquiry.href=`mailto:${window.siteEmail}?subject=${encodeURIComponent('Anfrage zu '+work.title)}`;
      dialog.showModal();
    });
  });
}

fetch('content.json').then(r=>r.json()).then(data=>{
  window.siteEmail=data.email;
  document.getElementById('about-text').textContent=data.about;
  document.getElementById('email-link').href=`mailto:${data.email}`;
  document.getElementById('instagram-link').href=data.instagram;
  renderWorks(data.canvas,'canvas-gallery');
  renderWorks(data.paper,'paper-gallery');

  const list=document.getElementById('exhibition-list');
  data.exhibitions.forEach(item=>{
    const row=document.createElement('div');
    row.className='exhibition-item';
    row.innerHTML=`<span>${item.year}</span><strong>${item.title}</strong><span>${item.location}</span>`;
    list.appendChild(row);
  });
});

dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{
  const r=dialog.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close();
});
document.getElementById('year').textContent=new Date().getFullYear();
