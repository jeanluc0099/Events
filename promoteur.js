let selectedLat = null;
let selectedLng = null;

// Carte
const map = L.map("mapPromoteur").setView([6.37, 2.39], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let marker;

map.on("click", function (e) {
  selectedLat = e.latlng.lat;
  selectedLng = e.latlng.lng;

  if (marker) marker.remove();
  marker = L.marker([selectedLat, selectedLng]).addTo(map);
});

// Formulaire
document.getElementById("eventForm").addEventListener("submit", async e => {
  e.preventDefault();

  if (!selectedLat || !selectedLng) {
    alert("Veuillez sélectionner la localisation sur la carte");
    return;
  }

  await db.collection("events").add({
    title: document.getElementById("title").value,
    date: document.getElementById("date").value,
    description: document.getElementById("description").value,
    lat: selectedLat,
    lng: selectedLng,
    promoterEmail: auth.currentUser.email,
    createdAt: Date.now()
  });

  alert("Événement créé !");
  document.getElementById("eventForm").reset();
});
