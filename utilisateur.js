const mapUser=L.map('map').setView([6.3703,2.3912],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap contributors' }).addTo(mapUser);

function afficherEvenementsUtilisateur(){
  const events=JSON.parse(localStorage.getItem('events'))||[];
  const now=new Date();
  const list=document.getElementById('events'); list.innerHTML='';
  events.filter(e=>new Date(e.date)>=now).forEach(e=>{
    const div=document.createElement('div'); div.className='event-card';
    div.innerHTML=`<h3>${e.title}</h3><p><strong>Date:</strong> ${e.date}</p><p><strong>Lieu:</strong> ${e.location}</p><p>${e.description}</p>`;
    list.appendChild(div);
    L.marker([e.lat,e.lon]).addTo(mapUser).bindPopup(`<b>${e.title}</b>`);
  });
}
afficherEvenementsUtilisateur();
