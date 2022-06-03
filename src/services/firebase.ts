import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, child, push, onValue, remove } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };

const app = initializeApp(firebaseConfig);


const auth = getAuth(app)
const db = getDatabase(app)
const dbRef = ref(db)

export { auth, db, dbRef, child, set, ref, push, remove, onValue }