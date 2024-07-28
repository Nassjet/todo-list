// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAegucVRS-jkxvFpVXRCiNnBa0DNi6OJr4",
  authDomain: "la-todo-list-de-nassjet.firebaseapp.com",
  projectId: "la-todo-list-de-nassjet",
  storageBucket: "la-todo-list-de-nassjet.appspot.com",
  messagingSenderId: "927645945397",
  appId: "1:927645945397:web:1a593ebad0d538ad64ab7c",
  measurementId: "G-C63NZ978B6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Authentifier l'utilisateur de manière anonyme
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Error signing in anonymously", error);
  });

export { db, auth };
