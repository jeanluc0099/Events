import { db, getDocs, collection } from "./firebase.js";

async function loadEvents() {
  const container = document.getElementById("eventsList");
  container.innerHTML = "<p>Chargement...</p>";

  const snapshot = await getDocs(collection(db, "events"));
  container.innerHTML = "";

  snapshot.forEach(doc => {
    const e = doc.data();

    const item = document.createElement("div");
    item.className = "event-card";

    item.innerHTML = `
      <h3>${e.title}</h3>
      <p>${e.description}</p>
      <p><b>Date :</b> ${e.date}</p>
      <button onclick="window.open('https://www.google.com/maps?q=${e.lat},${e.lng}')">📍 Localisation</button>
      <button onclick="window.location='mailto:${e.promoteurEmail}'">✉️ Contacter le promoteur</button>
    `;

    container.appendChild(item);
  });
}

loadEvents();
