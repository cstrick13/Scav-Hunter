
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyAckH9qRVL3H5kSpDQXl0A0VDNuDc-rVjY",
  authDomain: "scav-hunter.firebaseapp.com",
  projectId: "scav-hunter",
  storageBucket: "scav-hunter.firebasestorage.app",
  messagingSenderId: "209931916113",
  appId: "1:209931916113:web:505dc653e63477f8dd7970",
  measurementId: "G-GLMJBX8RD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
