// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAb4EbbRBhZoYtW9gWWEnP20St4rj_QUME",
  authDomain: "shopping-cart-app-ded95.firebaseapp.com",
  projectId: "shopping-cart-app-ded95",
  storageBucket: "shopping-cart-app-ded95.appspot.com", // ✅ corrected domain
  messagingSenderId: "538095404600",
  appId: "1:538095404600:web:1089030e963cda4cad48cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore DB
export const auth = getAuth(app);
export const db = getFirestore(app); 
