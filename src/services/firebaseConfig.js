//import { initializeApp, getApps, getApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDB-DiDKI66LJfxDT1TCwkjXnaHQmTtVUg",
  authDomain: "jobportal01-2c9ed.firebaseapp.com",
  projectId: "jobportal01-2c9ed",
  storageBucket: "jobportal01-2c9ed.appspot.com",
  messagingSenderId: "27322884453",
  appId: "1:27322884453:web:03b0629155051dd6a1c18c"
};
console.log('Initializing Firebase');

// Use the compat API exclusively.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
} else {
  console.log('Firebase app already initialized');
}

// Export services using compat APIs.
export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
