import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4KULv8Uy6UR-ICXMxUMkXfvaKv8Rwr6o",
  authDomain: "notes-app-35c92.firebaseapp.com",
  projectId: "notes-app-35c92",
  storageBucket: "notes-app-35c92.appspot.com",
  messagingSenderId: "943464869211",
  appId: "1:943464869211:web:6a444e0c7230240c2a3e7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);
export const notesCollection= collection(db,'notes');