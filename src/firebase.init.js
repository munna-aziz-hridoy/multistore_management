import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfaHTqNQcbxFt-JAKnR7qiAbqhYsMP7Oo",
  authDomain: "woo-multi-site-management.firebaseapp.com",
  projectId: "woo-multi-site-management",
  storageBucket: "woo-multi-site-management.appspot.com",
  messagingSenderId: "1013631217909",
  appId: "1:1013631217909:web:084c78b27c314e175895bc",
  measurementId: "G-9DN9QNGBZB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const firestore = getFirestore(app);

export { auth, firestore };
