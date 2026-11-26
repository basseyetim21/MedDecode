// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyC5MV4gEnbTy43xqF83lDdTtyVE4HUEWWY",

  authDomain: "meddecode-444e4.firebaseapp.com",

  projectId: "meddecode-444e4",

  storageBucket: "meddecode-444e4.firebasestorage.app",

  messagingSenderId: "1069873297048",

  appId: "1:1069873297048:web:3e38019b18b8c78d6882ed",

  measurementId: "G-9F7V00PG0K"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);