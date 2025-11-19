// Identifiant Promoteur
let promoteurId = prompt("Entrez votre identifiant de promoteur (nom/email) :");
if(!promoteurId) promoteurId="promoteur_test";

// Carte
const mapPromoteur = L.map('map').setView([6.3703,2.3912],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap contributors' }).addTo(mapPromoteur);

// Menu Principal
const menuBtn = document.createElement('button');
menuBtn.innerText = "Menu Principal";
menuBtn.className = "menu-btn";
menuBtn.onclick = ()=> window.location.href='index.html';
document.body.appendChild(menuBtn);

// Affichage événements promoteur
function afficherEvenementsPromoteur(){
    const events=JSON.parse(localStorage.getItem('events'))||[];
    const list=document.getElementById('events');
    list.innerHTML='';
    events.filter(e=>e.promoteur===promoteurId).forEach((e,i)=>{
        L.marker([e.lat,e.lon]).addTo(mapPromoteur).bindPopup(`<b>${e.title}</b>`);
        const div=document.createElement('div');
        div.className='event-card';
        div.innerHTML=`<h3>${e.title}</h3><p><strong>Date:</strong>${e.date}</p><p><strong>Lieu:</strong>${e.location}</p><p>${e.description}</p><button onclick="supprimer(${i})">Supprimer</button>`;
        list.appendChild(div);
    });
}

// Ajouter événement
document.getElementById('event-form').addEventListener('submit', async e=>{
    e.preventDefault();
    const title=document.getElementById('title').value;
    const location=document.getElementById('location').value;
    const date=document.getElementById('date').value;
    const description=document.getElementById('description').value;

    const res=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data=await res.json();
    if(!data.length) return alert('Lieu non trouvé');
    const {lat,lon}=data[0];

    const events=JSON.parse(localStorage.getItem('events'))||[];
    events.push({title,location,date,description,lat,lon,promoteur:promoteurId});
    localStorage.setItem('events',JSON.stringify(events));

    afficherEvenementsPromoteur();
    e.target.reset();
});

// Supprimer
function supprimer(index){
    let events=JSON.parse(localStorage.getItem('events'))||[];
    let filtered=events.filter(e=>e.promoteur===promoteurId);
    const eventToRemove=filtered[index];
    events=events.filter(e=>e!==eventToRemove);
    localStorage.setItem('events',JSON.stringify(events));
    afficherEvenementsPromoteur();
}

// Nettoyer événements passés
function nettoyerEvenements(){
    let events=JSON.parse(localStorage.getItem('events'))||[];
    const now=new Date();
    events=events.filter(e=>new Date(e.date)>=now);
    localStorage.setItem('events',JSON.stringify(events));
}
nettoyerEvenements();
afficherEvenementsPromoteur();
