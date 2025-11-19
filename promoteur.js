const mapPromoteur = L.map('map').setView([6.3703,2.3912],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap contributors' }).addTo(mapPromoteur);

function afficherEvenementsPromoteur() {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const list = document.getElementById('events'); list.innerHTML = '';
  events.forEach((e,i)=>{
    const div = document.createElement('div'); div.className='event-card';
    div.innerHTML=`<h3>${e.title}</h3><p><strong>Date:</strong> ${e.date}</p><p><strong>Lieu:</strong> ${e.location}</p><p>${e.description}</p><button onclick="supprimer(${i})">Supprimer</button>`;
    list.appendChild(div);
    L.marker([e.lat,e.lon]).addTo(mapPromoteur).bindPopup(`<b>${e.title}</b>`);
  });
}

function supprimer(index){
  const events=JSON.parse(localStorage.getItem('events')); events.splice(index,1); localStorage.setItem('events',JSON.stringify(events)); afficherEvenementsPromoteur();
}

document.getElementById('event-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const title=document.getElementById('title').value;
  const location=document.getElementById('location').value;
  const date=document.getElementById('date').value;
  const description=document.getElementById('description').value;
  const res=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
  const data=await res.json();
  if(!data.length) return alert('Lieu non trouvé');
  const {lat,lon}=data[0];
  const events=JSON.parse(localStorage.getItem('events'))||[];
  events.push({title,location,date,description,lat,lon});
  localStorage.setItem('events',JSON.stringify(events));
  afficherEvenementsPromoteur(); e.target.reset();
});

afficherEvenementsPromoteur();
