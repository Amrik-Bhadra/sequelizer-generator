import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoY1QhIGKn_dkrAjNGFi1YnOaq30HP9A4",
  authDomain: "sequelizer-d17a0.firebaseapp.com",
  projectId: "sequelizer-d17a0",
  storageBucket: "sequelizer-d17a0.firebasestorage.app",
  messagingSenderId: "467343122414",
  appId: "1:467343122414:web:e4e47e3802d96ff1a8f8ff",
  measurementId: "G-67Q29BHRPJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 
