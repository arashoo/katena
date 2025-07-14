// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBedg7d0rOpVc8WzEVAHaStT4fQGW6G1mg",
  authDomain: "katena-843d5.firebaseapp.com",
  projectId: "katena-843d5",
  storageBucket: "katena-843d5.firebasestorage.app",
  messagingSenderId: "646917407620",
  appId: "1:646917407620:web:72a0554b199c982ebd93d1",
  measurementId: "G-1M24JE6XHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
export {db};