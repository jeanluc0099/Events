import { auth, signOut, db, addDoc, collection } from "./firebase.js";

let latitude = null;
let longitude = null;

// --- Logout promoteur ---
document.getElementById("logout").onclick = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// --- MAP CLICK ---
const map = L.map("map").setView([6.37, 2.39], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let marker = null;

map.on("click", (e) => {
  latitude = e.latlng.lat;
  longitude = e.latlng.lng;

  if (marker) marker.remove();

  marker = L.marker([latitude, longitude]).addTo(map);
});

// --- Ajouter événement ---
document.getElementById("addEventBtn").onclick = async () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const date = document.getElementById("date").value.trim();

  if (!latitude || !longitude) {
    alert("Cliquez sur la carte pour définir la localisation.");
    return;
  }

  await addDoc(collection(db, "events"), {
    title,
    description,
    date,
    lat: latitude,
    lng: longitude,
    promoteurEmail: auth.currentUser.email
  });

  alert("Événement ajouté !");
};
