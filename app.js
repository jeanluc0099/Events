/* =========================
   app.js - Events Finder
   ========================= */

/* --- Global state --- */
let events = JSON.parse(localStorage.getItem('events')) || []; // { id, title, date, desc, lat, lng, contact, promoter }
let messages = JSON.parse(localStorage.getItem('messages')) || []; // contact messages
const now = () => new Date();

/* --- Helpers --- */
function saveEvents(){ localStorage.setItem('events', JSON.stringify(events)); }
function saveMessages(){ localStorage.setItem('messages', JSON.stringify(messages)); }
function uid(){ return crypto && crypto.randomUUID ? crypto.randomUUID() : (Date.now()+Math.floor(Math.random()*1000)); }

function cleanPastEvents(){
  events = events.filter(e => new Date(e.date) >= new Date(new Date().toDateString())); // keep events today and later
  saveEvents();
}
cleanPastEvents();

/* --- UI: menu control --- */
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
  menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
});

document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const view = btn.getAttribute('data-view');
    switchView(view);
    menu.style.display = 'none';
  });
});

/* --- View switching --- */
function switchView(name){
  document.querySelectorAll('.view').forEach(v=> v.classList.remove('active'));
  if(name === 'user') document.getElementById('view-user').classList.add('active');
  if(name === 'promoter') document.getElementById('view-promoter').classList.add('active');
  if(name === 'messages') document.getElementById('view-messages').classList.add('active');
}

/* default */
switchView('user');

/* --- User map & functions --- */
let mapUser, userMarker, userCoords = null;

function initUserMap(){
  mapUser = L.map('map-user', { zoomControl:true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapUser);

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      userCoords = [pos.coords.latitude, pos.coords.longitude];
      mapUser.setView(userCoords, 13);
      userMarker = L.marker(userCoords).addTo(mapUser).bindPopup('Vous êtes ici').openPopup();
      renderUserEvents();
    }, err=>{
      mapUser.setView([6.37,2.39], 12); // fallback
      renderUserEvents();
    });
  } else {
    mapUser.setView([6.37,2.39], 12);
    renderUserEvents();
  }
}

/* convert km to meters and Haversine distance check */
function haversineDistance(lat1, lon1, lat2, lon2){
  const R = 6371; // km
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // in km
}

/* Render events for user (only events happening today and in radius) */
let userEventMarkers = [];
function clearUserMarkers(){ userEventMarkers.forEach(m=>mapUser.removeLayer(m)); userEventMarkers = []; }

function renderUserEvents(){
  clearUserMarkers();
  const radiusKm = parseInt(document.getElementById('radius').value || 10);
  const container = document.getElementById('events-user');
  container.innerHTML = '';

  if(!userCoords){
    container.innerHTML = '<p class="muted">Position introuvable — autorisez la géolocalisation ou cliquez \"Actualiser position\".</p>';
  }

  const today = new Date(new Date().toDateString());

  events.filter(e => new Date(e.date) >= today).forEach(ev=>{
    // distance calculation
    if(!userCoords) return; // skip if no location
    const dKm = haversineDistance(userCoords[0], userCoords[1], ev.lat, ev.lng);
    if(dKm <= radiusKm){
      // card
      const card = document.createElement('div');
      card.className = 'eventCard';
      card.innerHTML = `
        <h3>${ev.title}</h3>
        <p class="muted">Date: ${ev.date}</p>
        <p>${ev.desc}</p>
        <p class="muted">Distance: ${dKm.toFixed(1)} km</p>
        <div class="card-actions">
          <button class="btn" data-follow="${ev.id}">Suivre la localisation</button>
          <a class="btn ghost" target="_blank" href="${makeDirectionsLink(ev)}">Itinéraire (Google Maps)</a>
          <button class="btn" data-contact="${ev.id}">Contacter le promoteur</button>
        </div>
      `;
      container.appendChild(card);

      // marker
      const m = L.marker([ev.lat, ev.lng]).addTo(mapUser).bindPopup(`<b>${ev.title}</b><br>${ev.desc}`);
      userEventMarkers.push(m);
    }
  });

  // attach handlers for follow/contact
  document.querySelectorAll('[data-follow]').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const id = e.target.getAttribute('data-follow');
      followEventLocation(id);
    });
  });
  document.querySelectorAll('[data-contact]').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const id = e.target.getAttribute('data-contact');
      openContactModal(id);
    });
  });
}

/* make google maps directions link */
function makeDirectionsLink(ev){
  if(!userCoords) return `https://www.google.com/maps/search/?api=1&query=${ev.lat},${ev.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${userCoords[0]},${userCoords[1]}&destination=${ev.lat},${ev.lng}`;
}

/* follow: center map and highlight */
let followCircle = null;
function followEventLocation(evId){
  const ev = events.find(x=>x.id===evId);
  if(!ev) return alert('Événement introuvable');
  mapUser.setView([ev.lat, ev.lng], 16);
  if(followCircle) mapUser.removeLayer(followCircle);
  followCircle = L.circle([ev.lat, ev.lng], {radius:80, color:'#0077c2', fillOpacity:0.2}).addTo(mapUser);
  // open popup on marker if exists
}

/* contact modal logic (only user view) */
const contactModal = document.getElementById('contactModal');
const contactInfo = document.getElementById('contactInfo');
const contactForm = document.getElementById('contactForm');
let contactTargetEventId = null;

function openContactModal(evId){
  const ev = events.find(x=>x.id===evId);
  if(!ev) return alert('Événement introuvable');
  contactTargetEventId = evId;
  contactInfo.innerHTML = `<p><strong>${ev.title}</strong><br/>Promoteur: ${ev.promoter || 'Non renseigné'}<br/>Contact: ${ev.contact || 'Non renseigné'}</p>`;
  contactModal.classList.remove('hidden');
  document.getElementById('contactName').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactMessage').value = '';
}
document.getElementById('closeContact').addEventListener('click', ()=> contactModal.classList.add('hidden') );

contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!contactTargetEventId) return;
  const payload = {
    id: uid(),
    eventId: contactTargetEventId,
    name: document.getElementById('contactName').value,
    email: document.getElementById('contactEmail').value,
    message: document.getElementById('contactMessage').value,
    date: new Date().toISOString()
  };
  messages.push(payload);
  saveMessages();
  contactModal.classList.add('hidden');
  alert('Message envoyé au promoteur (stocké localement).');
  renderMessagesList();
});

/* render messages list (messages view) */
function renderMessagesList(){
  const box = document.getElementById('messagesList');
  box.innerHTML = '';
  if(messages.length===0) box.innerHTML = '<p class="muted">Aucun message.</p>';
  messages.slice().reverse().forEach(m=>{
    const d = document.createElement('div');
    d.className = 'eventCard';
    d.innerHTML = `<p><strong>${m.name}</strong> (${m.email})</p><p>${m.message}</p><p class="muted">${new Date(m.date).toLocaleString()}</p>`;
    box.appendChild(d);
  });
}

/* --- Promoter map & functions --- */
let mapPromoter;
let promoterMarker = null;
let selectedCoords = null;
let currentPromoterId = null;

function initPromoterMap(){
  mapPromoter = L.map('map-promoter');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapPromoter);
  mapPromoter.setView([6.37,2.39], 12);

  // click to select coords
  mapPromoter.on('click', function(e){
    const lat = e.latlng.lat, lng = e.latlng.lng;
    selectedCoords = [lat, lng];
    if(promoterMarker) mapPromoter.removeLayer(promoterMarker);
    promoterMarker = L.marker([lat,lng]).addTo(mapPromoter).bindPopup('Lieu sélectionné').openPopup();
    document.getElementById('evLat').value = lat.toFixed(6);
    document.getElementById('evLng').value = lng.toFixed(6);
  });

  renderPromoterEvents();
}

/* add event (promoter) */
document.getElementById('addEvBtn').addEventListener('click', ()=> addEventFromForm());
function addEventFromForm(){
  if(!currentPromoterId){
    alert('Connectez-vous d\'abord (Identifiant promoteur).');
    return;
  }
  const title = document.getElementById('evTitle').value.trim();
  const date = document.getElementById('evDate').value;
  const desc = document.getElementById('evDesc').value.trim();
  const contact = document.getElementById('evContact').value.trim();
  const lat = parseFloat(document.getElementById('evLat').value);
  const lng = parseFloat(document.getElementById('evLng').value);

  if(!title || !date || isNaN(lat) || isNaN(lng)){
    return alert('Remplissez au minimum : titre, date et lieu (lat/lng).');
  }

  const ev = {
    id: uid(),
    title,
    date,
    desc,
    lat,
    lng,
    contact,
    promoter: currentPromoterId
  };
  events.push(ev);
  saveEvents();
  alert('Événement ajouté.');
  renderPromoterEvents();
  renderUserEvents();
  // reset form
  document.getElementById('evTitle').value='';
  document.getElementById('evDate').value='';
  document.getElementById('evDesc').value='';
  document.getElementById('evContact').value='';
  document.getElementById('evLat').value='';
  document.getElementById('evLng').value='';
  if(promoterMarker){ mapPromoter.removeLayer(promoterMarker); promoterMarker=null; selectedCoords=null; }
}

/* promoter login */
document.getElementById('promoterLogin').addEventListener('click', ()=>{
  const id = document.getElementById('promoterId').value.trim();
  if(!id) return alert('Entrez un identifiant (nom ou email)');
  currentPromoterId = id;
  alert('Connecté en tant que : ' + id);
  renderPromoterEvents();
});

/* render promoter events (only events by this promoter) */
function renderPromoterEvents(){
  const box = document.getElementById('events-promoter');
  box.innerHTML = '';
  if(!currentPromoterId){
    box.innerHTML = '<p class="muted">Veuillez entrer votre identifiant promoteur pour voir vos événements.</p>';
    return;
  }
  const my = events.filter(e=> e.promoter === currentPromoterId);
  if(my.length===0) box.innerHTML = '<p class="muted">Vous n\'avez aucun événement pour l\'instant.</p>';
  my.forEach((ev, idx)=>{
    const c = document.createElement('div');
    c.className = 'eventCard';
    c.innerHTML = `<h3>${ev.title}</h3><p class="muted">${ev.date}</p><p>${ev.desc}</p><p>Contact: ${ev.contact || '—'}</p>`;
    const del = document.createElement('button');
    del.className = 'deleteBtn';
    del.textContent = 'Supprimer';
    del.addEventListener('click', ()=> {
      if(confirm('Supprimer cet événement ?')){
        events = events.filter(x=> x.id !== ev.id);
        saveEvents();
        renderPromoterEvents();
        renderUserEvents();
      }
    });
    c.appendChild(del);
    box.appendChild(c);
  });

  // also show markers for promoter on promoter map
  if(mapPromoter){
    // remove existing sport markers - simplest: reload map tiles => remove all layers then add tile, then re-add markers
    mapPromoter.eachLayer(layer=>{
      if(layer.options && layer.options.attribution) return; // tile layer
      mapPromoter.removeLayer(layer);
    });
    my.forEach(ev=>{
      L.marker([ev.lat, ev.lng]).addTo(mapPromoter).bindPopup(ev.title);
    });
  }
}

/* init everything on load */
window.addEventListener('load', ()=>{
  // init user map and promoter map
  initUserMap();
  initPromoterMap();
  renderMessagesList();

  // refresh position button
  document.getElementById('refreshBtn').addEventListener('click', ()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
        userCoords = [pos.coords.latitude, pos.coords.longitude];
        mapUser.setView(userCoords, 13);
        if(userMarker){ mapUser.removeLayer(userMarker); }
        userMarker = L.marker(userCoords).addTo(mapUser).bindPopup('Vous êtes ici').openPopup();
        renderUserEvents();
      }, ()=> alert('Impossible d\'obtenir la position'));
    }
  });

  document.getElementById('radius').addEventListener('change', ()=> renderUserEvents());
});
