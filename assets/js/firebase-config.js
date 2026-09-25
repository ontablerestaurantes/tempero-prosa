import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDF3cRoVWh7z4Bk3yYSEodkH5PLLQpaPDM",
  authDomain: "tempero-e-prosa.firebaseapp.com",
  projectId: "tempero-e-prosa",
  storageBucket: "tempero-e-prosa.firebasestorage.app",
  messagingSenderId: "641209729346",
  appId: "1:641209729346:web:8325c8cac52914c64988db"
};

const app = initializeApp(firebaseConfig);

export const firebaseProjectId = firebaseConfig.projectId;
export const db = getFirestore(app);
export const auth = getAuth(app);

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};