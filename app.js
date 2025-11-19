// Events T — app.js (vanilla JS)
}


function cardFromEv(ev){
const div = document.createElement('div');
div.className = 'event-card';
div.innerHTML = `
<div>
<div style="font-weight:700">${escapeHtml(ev.title)}</div>
<div class="event-meta">${escapeHtml(ev.city||'')} — ${formatDateTime(ev.dt)}</div>
<div style="margin-top:6px" class="muted">${escapeHtml(ev.desc||'')}</div>
<div class="event-actions">
${ev.phone?`<a href="tel:${encodeURIComponent(ev.phone)}"><button class="btn">Appeler</button></a>`:''}
${ev.email?`<a href="mailto:${encodeURIComponent(ev.email)}"><button class="btn">Email</button></a>`:''}
${ev.lat && ev.lon ? `<a target="_blank" href="https://www.openstreetmap.org/?mlat=${ev.lat}&mlon=${ev.lon}#map=18/${ev.lat}/${ev.lon}"><button class="btn">Carte</button></a>` : (ev.address?`<a target="_blank" href="https://www.openstreetmap.org/search?query=${encodeURIComponent(ev.address)}"><button class="btn">Adresse</button></a>`:'')}
</div>
</div>
`;
return div;
}


// Form handling
const addForm = document.getElementById('addForm');
addForm.addEventListener('submit', e=>{
e.preventDefault();
const title = document.getElementById('title').value.trim();
const desc = document.getElementById('desc').value.trim();
const city = document.getElementById('city').value.trim();
const address = document.getElementById('address') ? document.getElementById('address').value.trim() : '';
const date = document.getElementById('date').value;
const time = document.getElementById('time').value;
const phone = document.getElementById('phone').value.trim();
const email = document.getElementById('email').value.trim();
const lat = document.getElementById('lat').value.trim();
const lon = document.getElementById('lon').value.trim();


if(!title || !date || !time || !city){ alert('Remplis au moins : titre, date, heure, localité'); return; }
const iso = new Date(date + 'T' + time + ':00').toISOString();
const ev = { id: Date.now().toString(36), title, desc, city, address, iso, phone, email, lat: lat||null, lon: lon||null };
const list = loadEvents();
list.push(ev);
saveEvents(list);
addForm.reset();
render();
});


// optional clear button
const clearBtn = document.getElementById('clearBtn');
if(clearBtn) clearBtn.addEventListener(

