import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebasePdfsConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_PDFS_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_PDFS_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PDFS_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_PDFS_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_PDFS_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_PDFS_APP_ID,
};

const appPdfs = initializeApp(firebasePdfsConfig, "pdfs");

export const dbPdfs = getFirestore(appPdfs)
