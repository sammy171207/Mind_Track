import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmMouLmlzPGyUAcrecoHH1mRTqnX5gctw",
  authDomain: "crud-7e23e.firebaseapp.com",
  databaseURL: "https://crud-7e23e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crud-7e23e",
  storageBucket: "crud-7e23e.firebasestorage.app",
  messagingSenderId: "890167662217",
  appId: "1:890167662217:web:2570fe2b8f29f809829858",
  measurementId: "G-Y0RZQVBLNK"
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
let auth;
try {
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
  throw error;
}

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };

// Initialize Cloud Firestore and get a reference to the service
let db;
try {
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firestore:', error);
  throw error;
}

export { db };
export default app;
