import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "./firebase.js";

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "promoteur.html";
      })
      .catch(err => {
        alert("Erreur de connexion : " + err.message);
      });
  });
}

// Vérifier session promoteur
onAuthStateChanged(auth, (user) => {
  if (document.body.dataset.page === "promoteur") {
    if (!user) window.location.href = "login.html";
  }
});
