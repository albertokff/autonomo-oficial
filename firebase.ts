// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLru9sJ9ESOf1BT3K5i2WgXviNqoXcoNw",
  authDomain: "autonomoapp-8f3ab.firebaseapp.com",
  projectId: "autonomoapp-8f3ab",
  storageBucket: "autonomoapp-8f3ab.firebasestorage.app",
  messagingSenderId: "142580981794",
  appId: "1:142580981794:web:3d98ac96b06564c003ea7b",
  measurementId: "G-48DD3VR3K9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
