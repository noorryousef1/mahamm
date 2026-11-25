import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtu6QUHbFa_VBTTo1Qg5xQJZVJT48K4Ug",
  authDomain: "mahamm-29995.firebaseapp.com",
  projectId: "mahamm-29995",
  storageBucket: "mahamm-29995.firebasestorage.app",
  messagingSenderId: "816826454218",
  appId: "1:816826454218:web:9c747a00ab9f4cc9c06433",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
