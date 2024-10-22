import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyADXtsz0oJddxGYi3cEAPqO4n00B0aAYAw",
  authDomain: "realtime-text-sharer.firebaseapp.com",
  databaseURL: "https://realtime-text-sharer-default-rtdb.firebaseio.com",
  projectId: "realtime-text-sharer",
  storageBucket: "realtime-text-sharer.appspot.com",
  messagingSenderId: "492253525095",
  appId: "1:492253525095:web:31ddfe5ca08f2a55f190c2",
};

// Initialize Firebase
const FIREBASE = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const DATABASE = getDatabase(
  FIREBASE,
  "https://realtime-text-sharer-default-rtdb.firebaseio.com/"
);

export { DATABASE };
