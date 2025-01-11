// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTvf1W36-WXz3TQLcqvM9sp5YBWROwi28",
  authDomain: "taskbuddy-33cd5.firebaseapp.com",
  projectId: "taskbuddy-33cd5",
  storageBucket: "taskbuddy-33cd5.firebasestorage.app",
  messagingSenderId: "599273344987",
  appId: "1:599273344987:web:3b0b1cc1abb282320161fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth , provider};