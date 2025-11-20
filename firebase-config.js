// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWX2UN5whFp1GXKhQpD6HFTZx2sfCSLfo",
  authDomain: "events-app-754f4.firebaseapp.com",
  projectId: "events-app-754f4",
  storageBucket: "events-app-754f4.firebasestorage.app",
  messagingSenderId: "908087963056",
  appId: "1:908087963056:web:024a5fae9c2a1229397a75",
  measurementId: "G-2NYNMFR16Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORTS
export const auth = getAuth(app);
export const db = getFirestore(app);
export {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  addDoc,
  getDocs
};
