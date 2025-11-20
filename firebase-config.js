// firebase-config.js
// Firebase V10+ (modular) — configuration & exports

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { 
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your Firebase config (provided)
const firebaseConfig = {
  apiKey: "AIzaSyAWX2UN5whFp1GXKhQpD6HFTZx2sfCSLfo",
  authDomain: "events-app-754f4.firebaseapp.com",
  projectId: "events-app-754f4",
  storageBucket: "events-app-754f4.firebasestorage.app",
  messagingSenderId: "908087963056",
  appId: "1:908087963056:web:024a5fae9c2a1229397a75",
  measurementId: "G-2NYNMFR16Q"
};

// Init
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export for usage in other modules
export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
};
