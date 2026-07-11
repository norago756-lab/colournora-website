
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
const dinquiry=dialog.querySelector('.inquiry');

function imagePath(value){
  if(!value) return '';
  return value.startsWith('/') ? value : value;
}

function renderWorks(items,targetId,email){
  const target=document.getElementById(targetId);
  target.innerHTML='';
  (items||[]).forEach(work=>{
    const article=document.createElement('article');
    article.className='work reveal';
    const status=work.status ? `<span>${work.status}</span>` : '';
    article.innerHTML=`
      <button aria-label="${work.title||'Werk'} öffnen">
        <img src="${imagePath(work.image)}" alt="${work.title||'Werk von Nora Göller'}" loading="lazy">
      </button>
      <div class="work-meta">
        <div>
          <h3>${work.title||'Ohne Titel'}</h3>
          <p>${work.medium||''}</p>
        </div>
        ${status}
      </div>`;
    target.appendChild(article);
    observer.observe(article);

    article.querySelector('button').addEventListener('click',()=>{
      dimg.src=imagePath(work.image);
      dimg.alt=work.title||'Werk von Nora Göller';
      dtitle.textContent=work.title||'Ohne Titel';
      dmedium.textContent=work.medium||'';
      dsize.textContent=work.size||'Auf Anfrage';
      dyear.textContent=work.year||'';
      dstatus.textContent=work.status||'Available on request';
      dinquiry.href=`mailto:${email}?subject=${encodeURIComponent('Anfrage zu '+(work.title||'einem Kunstwerk'))}`;
      dialog.showModal();
    });
  });
}

fetch('content.json')
  .then(response=>{
    if(!response.ok) throw new Error('content.json konnte nicht geladen werden');
    return response.json();
  })
  .then(data=>{
    window.siteEmail=data.email;

    document.querySelector('.brand').textContent=data.artist||'Nora Göller';
    document.querySelector('.subtitle').textContent=data.subtitle||'Contemporary Abstract Artist';
    document.getElementById('about-text').textContent=data.about||'';
    document.getElementById('email-link').href=`mailto:${data.email}`;
    document.getElementById('email-link').textContent=data.email;
    document.getElementById('instagram-link').href=data.instagram;

    if(data.hero_image) document.getElementById('hero-image').src=imagePath(data.hero_image);
    if(data.about_image) document.getElementById('about-image').src=imagePath(data.about_image);

    renderWorks(data.canvas,'canvas-gallery',data.email);
    renderWorks(data.paper,'paper-gallery',data.email);

    const list=document.getElementById('exhibition-list');
    list.innerHTML='';
    (data.exhibitions||[]).forEach(item=>{
      const row=document.createElement('article');
      row.className='exhibition-item';
      row.innerHTML=`
        <span>${item.year||''}</span>
        <div>
          <strong>${item.title||''}</strong>
          ${item.description?`<p>${item.description}</p>`:''}
        </div>
        <span>${item.location||''}</span>`;
      list.appendChild(row);
    });
  })
  .catch(error=>{
    console.error(error);
    document.getElementById('canvas-gallery').innerHTML='<p>Die Inhalte konnten gerade nicht geladen werden.</p>';
  });

dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  const rect=dialog.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||
     event.clientY<rect.top||event.clientY>rect.bottom){
    dialog.close();
  }
});
document.getElementById('year').textContent=new Date().getFullYear();
