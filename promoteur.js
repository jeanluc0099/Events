// promoteur.js
import {
    auth,
    signOut,
    db,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "./firebase.js";

document.addEventListener('DOMContentLoaded', async () => {

    const logoutBtn = document.getElementById('logoutBtn');
    const addEventForm = document.getElementById('addEventForm');
    const eventList = document.getElementById('promoterEventList');
    const coordDisplay = document.getElementById('coordDisplay');

    let selectedLat = null;
    let selectedLng = null;

    // Init map for event location
    const map = L.map('promoterMap').setView([6.37, 2.39], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    let marker = null;

    // Click to choose location
    map.on('click', (e) => {
        selectedLat = e.latlng.lat;
        selectedLng = e.latlng.lng;

        coordDisplay.textContent = 
            `Lat: ${selectedLat.toFixed(5)} | Lng: ${selectedLng.toFixed(5)}`;

        if (marker) map.removeLayer(marker);

        marker = L.marker([selectedLat, selectedLng]).addTo(map);
    });

    // Load promoter events
    async function loadPromoterEvents() {
        eventList.innerHTML = "<p class='muted'>Chargement…</p>";

        const snapshot = await getDocs(collection(db, "events"));
        eventList.innerHTML = "";

        snapshot.forEach(d => {
            const ev = d.data();

            if (ev.promoteurEmail === auth.currentUser.email) {
                const item = document.createElement("div");
                item.className = "event-card";

                item.innerHTML = `
                    <h3>${ev.title}</h3>
                    <p class="muted">${ev.date}</p>
                    <p>${ev.description || ""}</p>
                    <button class="small deleteBtn">🗑 Supprimer</button>
                `;

                item.querySelector(".deleteBtn").addEventListener('click', async () => {
                    await deleteDoc(doc(db, "events", d.id));
                    loadPromoterEvents();
                });

                eventList.appendChild(item);
            }
        });
    }

    // Add Event
    addEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value.trim();
        const contact = document.getElementById('contact').value.trim();

        if (!selectedLat || !selectedLng) {
            alert("Cliquez sur la carte pour définir la localisation.");
            return;
        }

        await addDoc(collection(db, "events"), {
            title,
            date,
            description,
            promoterContact: contact,
            promoteurEmail: auth.currentUser.email,
            lat: selectedLat,
            lng: selectedLng
        });

        alert("Événement ajouté !");
        addEventForm.reset();
        coordDisplay.textContent = "Aucune localisation sélectionnée";
        selectedLat = null;
        selectedLng = null;

        if (marker) map.removeLayer(marker);

        loadPromoterEvents();
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });

    // Require login
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "login.html";
        } else {
            loadPromoterEvents();
        }
    });

});
