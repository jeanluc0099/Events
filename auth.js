// INSCRIPTION
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPassword").value;

    auth.createUserWithEmailAndPassword(email, pass)
      .then(() => {
        alert("Compte créé !");
        window.location.href = "promoteur.html";
      })
      .catch(err => alert(err.message));
  });
}

// CONNEXION
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, pass)
      .then(() => {
        window.location.href = "promoteur.html";
      })
      .catch(err => alert(err.message));
  });
}

// PROTECTION DES PAGES
auth.onAuthStateChanged(user => {
  const protectedPages = ["promoteur.html"];

  if (protectedPages.includes(location.pathname.replace("/", ""))) {
    if (!user) {
      window.location.href = "login.html";
    }
  }
});

// DÉCONNEXION
if (document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => {
      window.location.href = "login.html";
    });
  };
}
