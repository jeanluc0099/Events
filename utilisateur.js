let rayon = 10;

// Bouton Menu Principal
const menuBtn = document.createElement('button');
menuBtn.innerText = "Menu Principal";
menuBtn.className = "menu-btn";
menuBtn.onclick = ()=> window.location.href='index.html';
document.body.appendChild(menuBtn);

// Calcul distance
function calculerDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Affichage événements
function afficherEvenementsUtilisateur(latUser, lonUser) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const now = new Date();
    const list = document.getElementById('events');
    list.innerHTML = '';

    events.filter(e => new Date(e.date).toDateString() === now.toDateString())
          .forEach(e=>{
        if(calculerDistance(latUser, lonUser, e.lat, e.lon)<=rayon){
            const div = document.createElement('div');
            div.className='event-card';
            div.innerHTML=`<h3>${e.title}</h3><p><strong>Date:</strong> ${e.date}</p><p><strong>Lieu:</strong> ${e.location}</p><p>${e.description}</p>`;
            list.appendChild(div);
            L.marker([e.lat,e.lon]).addTo(mapUser).bindPopup(`<b>${e.title}</b>`);
        }
    });
}

// Géolocalisation + carte
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
        const latUser = pos.coords.latitude;
        const lonUser = pos.coords.longitude;

        window.mapUser = L.map('map').setView([latUser, lonUser],12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap contributors' }).addTo(mapUser);

        let cercle = L.circle([latUser,lonUser],{radius: rayon*1000,color:'blue',fillOpacity:0.2}).addTo(mapUser);
        afficherEvenementsUtilisateur(latUser,lonUser);

        document.getElementById('rayon-select').addEventListener('change', e=>{
            rayon=parseInt(e.target.value);
            cercle.setRadius(rayon*1000);
            afficherEvenementsUtilisateur(latUser,lonUser);
        });
    }, err=>alert('Impossible de récupérer votre position.'));
}else alert('Géolocalisation non supportée.');
