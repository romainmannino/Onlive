(()=>{
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1}).format(Number(n||0));
const dstr=d=>{const x=new Date(d);return isNaN(x)?'—':x.toLocaleDateString('fr-FR')};
const dtstr=d=>{const x=new Date(d);return isNaN(x)?'—':x.toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})};
const initials=n=>(String(n||'U').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('')||'U').toUpperCase();
const avatar=(url,name)=>url?`<img class="v2Avatar" src="${esc(url)}">`:`<div class="v2Avatar">${esc(initials(name))}</div>`;
function range(){const p=document.getElementById('usersStats');return{from:p?.querySelector('.v2From')?.value,to:p?.querySelector('.v2To')?.value}}
async function loadEnhancedUsers(){
 const body=document.getElementById('usersStatsBody'); if(!body||typeof sb==='undefined')return;
 const {from,to}=range(); if(!from||!to)return;
 const search=(document.getElementById('userSearch')?.value||'').trim();
 const {data,error}=await sb.rpc('admin_users_range',{date_from:from,date_to:to,search_text:search||null});
 if(error){body.innerHTML=`<div class="err">${esc(error.message)}</div>`;return}
 const rows=data||[];
 body.innerHTML=rows.length?`<table class="v2Table"><thead><tr><th>Utilisateur</th><th>Programmes</th><th>Min.</th><th>Msgs</th><th>Favoris</th><th>Contacts ONLIVE</th><th>Dernière activité</th></tr></thead><tbody>${rows.map(x=>`<tr class="click adminUserV3" data-user="${x.user_id}"><td><div class="v2Name">${avatar(x.avatar_url,x.display_name)}<div><b>${esc(x.display_name)}</b><div class="v2Muted">${esc(x.email||'')}</div><div class="v2Muted">${esc(x.phone_e164||'')}</div></div></div></td><td>${fmt(x.programs_watched)}</td><td>${fmt(x.total_watch_minutes)}</td><td>${fmt(x.messages_sent)}</td><td>${fmt(x.favorites_count)}</td><td>${fmt(x.matched_contacts)}</td><td>${dtstr(x.last_activity)}</td></tr>`).join('')}</tbody></table>`:'<div class="v2Empty">Aucun utilisateur.</div>';
 body.querySelectorAll('.adminUserV3').forEach(r=>r.onclick=()=>openEnhancedUser(r.dataset.user));
}
async function openEnhancedUser(id){
 const modal=document.getElementById('v2Modal'); if(!modal)return; modal.classList.remove('hidden');
 document.getElementById('v2ModalTitle').innerHTML='<h2 style="margin:0">Profil utilisateur</h2>';
 const body=document.getElementById('v2ModalBody'); body.innerHTML='<div class="v2Empty">Chargement…</div>';
 const {from,to}=range(); const {data,error}=await sb.rpc('admin_user_detail',{target_user:id,date_from:from,date_to:to});
 if(error){body.innerHTML=`<div class="err">${esc(error.message)}</div>`;return}
 const p=data?.profile||{},fav=data?.favorites||[],progs=data?.programs||[],rels=data?.relations||[],contacts=data?.matched_contacts||[];
 body.innerHTML=`<div class="v2DetailHero">${avatar(p.avatar_url,p.display_name)}<div><h2 style="margin:0">${esc(p.display_name||'Utilisateur')}</h2><div class="v2Muted">${esc(p.email||'')}</div><div class="v2Muted">${esc(p.phone_e164||'')} · inscrit le ${dstr(p.created_at)}</div></div></div>
 <div class="v2Kpis" style="margin-top:16px;grid-template-columns:repeat(4,1fr)"><div class="v2Kpi"><strong>${fmt(data.messages)}</strong><span>Messages</span></div><div class="v2Kpi"><strong>${fmt(data.rooms)}</strong><span>Discussions</span></div><div class="v2Kpi"><strong>${fav.length}</strong><span>Favoris</span></div><div class="v2Kpi"><strong>${fmt(p.matched_contacts)}</strong><span>Contacts ONLIVE</span></div></div>
 <div class="v2Section"><h3>Favoris</h3><div class="v2Tags">${fav.length?fav.map(f=>`<span class="v2Tag">${esc(f.label||f.key)}</span>`).join(''):'<span class="v2Muted">Aucun favori enregistré.</span>'}</div></div>
 <div class="v2Section"><h3>Relations ONLIVE</h3>${rels.length?`<table class="v2Table"><tr><th>Utilisateur</th><th>Discussions communes</th><th>Messages</th></tr>${rels.map(x=>`<tr><td><div class="v2Name">${avatar(x.avatar_url,x.display_name)}<div><b>${esc(x.display_name)}</b><div class="v2Muted">${esc(x.email||'')}</div></div></div></td><td>${fmt(x.shared_rooms)}</td><td>${fmt(x.messages)}</td></tr>`).join('')}</table>`:'<div class="v2Muted">Aucune relation enregistrée sur cette période.</div>'}</div>
 <div class="v2Section"><h3>Contacts ONLIVE trouvés dans son carnet</h3><div class="v2Muted" style="margin-bottom:8px">Uniquement les contacts déjà inscrits sur ONLIVE, pas le carnet complet.</div>${contacts.length?`<table class="v2Table"><tr><th>Nom dans son téléphone</th><th>Compte ONLIVE</th><th>E-mail</th></tr>${contacts.map(x=>`<tr><td>${esc(x.local_name||'')}</td><td>${esc(x.display_name||'Utilisateur')}</td><td>${esc(x.email||'')}</td></tr>`).join('')}</table>`:'<div class="v2Muted">Aucun contact ONLIVE correspondant enregistré.</div>'}</div>
 <div class="v2Section"><h3>Programmes regardés</h3>${progs.length?`<table class="v2Table"><tr><th>Programme</th><th>Date</th><th>Sessions</th><th>Min.</th></tr>${progs.map(x=>`<tr><td>${esc(x.title)}<div class="v2Muted">${esc(x.channel)}</div></td><td>${dstr(x.program_date)}</td><td>${fmt(x.sessions)}</td><td>${fmt(x.minutes)}</td></tr>`).join('')}</table>`:'<div class="v2Muted">Aucune session sur cette période.</div>'}</div>`;
}
function hook(){
 const btn=[...document.querySelectorAll('.sideNav button')].find(b=>b.dataset.page==='usersStats');
 if(btn)btn.addEventListener('click',()=>setTimeout(loadEnhancedUsers,180));
 const search=document.getElementById('userSearch'); if(search)search.addEventListener('input',()=>setTimeout(loadEnhancedUsers,80));
 const panel=document.getElementById('usersStats'); if(panel){panel.querySelectorAll('[data-days],.v2Apply').forEach(b=>b.addEventListener('click',()=>setTimeout(loadEnhancedUsers,220)))}
 const obs=new MutationObserver(()=>{if(document.getElementById('usersStats')?.classList.contains('on')){const body=document.getElementById('usersStatsBody');if(body&&!body.dataset.v3){body.dataset.v3='1';setTimeout(loadEnhancedUsers,120)}}});
 obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
}
window.addEventListener('DOMContentLoaded',()=>setTimeout(hook,250));
})();
