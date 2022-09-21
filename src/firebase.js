// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuw-uBUd4dzqKO-PZZD22nBjg2FhbeqlU",
  authDomain: "takwith-chatbox.firebaseapp.com",
  projectId: "takwith-chatbox",
  storageBucket: "takwith-chatbox.appspot.com",
  messagingSenderId: "42898248040",
  appId: "1:42898248040:web:3932766714f799c2dbc6dd"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
  

