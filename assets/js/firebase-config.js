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
  apiKey: "AIzaSyAipkjePdnsik3C-bEz1yg4L_bbu_nTnKM",
  authDomain: "cardapiopremium-3f36e.firebaseapp.com",
  projectId: "cardapiopremium-3f36e",
  storageBucket: "cardapiopremium-3f36e.firebasestorage.app",
  messagingSenderId: "272588682804",
  appId: "1:272588682804:web:0c8f35cf5cdb84b313fc61",
  measurementId: "G-28Q567RYNV"
};

const app = initializeApp(firebaseConfig);

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