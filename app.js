const list = document.getElementById("events-list");

// Récupération des événements
db.collection("events")
  .orderBy("date")
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      const ev = doc.data();

      // Événements passés ignorés
      if (new Date(ev.date) < new Date()) return;

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <h3>${ev.title}</h3>
        <p>${ev.description}</p>
        <p><strong>Date :</strong> ${ev.date}</p>

        <button onclick="showOnMap(${ev.lat}, ${ev.lng})">Voir sur carte</button>
        <button onclick="contact('${ev.promoterEmail}')">Contacter le promoteur</button>
      `;

      list.appendChild(card);
    });
  });

// Carte utilisateur
const map = L.map("map").setView([6.37, 2.39], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

function showOnMap(lat, lng) {
  L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 15);
}

function contact(email) {
  window.location.href = `mailto:${email}`;
}
