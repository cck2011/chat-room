import  firebase from "firebase/compat/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCAK08-USghBq2G_CzoZ5Ukh17oM8HlMp8",
    authDomain: "cantek-chat-room-db88e.firebaseapp.com",
    projectId: "cantek-chat-room-db88e",
    storageBucket: "cantek-chat-room-db88e.appspot.com",
    messagingSenderId: "848780389526",
    appId: "1:848780389526:web:caf4c2e9625e228bba26b7"
  };
export const provider = new GoogleAuthProvider();
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);