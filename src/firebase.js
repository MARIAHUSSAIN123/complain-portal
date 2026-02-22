import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJg6EbwJsOzWhrxeGCwWQUemsqiW52fq0",
  authDomain: "lost-found-12f3c.firebaseapp.com",
  databaseURL: "https://lost-found-12f3c-default-rtdb.firebaseio.com",
  projectId: "lost-found-12f3c",
  storageBucket: "lost-found-12f3c.firebasestorage.app",
  messagingSenderId: "414084362233",
  appId: "1:414084362233:web:2ce883ef4bfaf92e271728",
  measurementId: "G-3HQM87SXKV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);