// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging/sw";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL9_j6L59vQhwCVx2SR5FiGHCNfHdyrjI",
  authDomain: "loominate-2021.firebaseapp.com",
  databaseURL: "https://loominate-2021-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loominate-2021",
  storageBucket: "loominate-2021.appspot.com",
  messagingSenderId: "951207115901",
  appId: "1:951207115901:web:ec068d1138c404064cc514"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export const realtimeDB = getDatabase(firebase);
export const firebaseMessage = getMessaging(firebase);

export default firebase;
