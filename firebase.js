import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBNb349qVwvOVz235YjIz4-Nzvo8yD45Gg',
  authDomain: 'd3-firebase-demo.firebaseapp.com',
  projectId: 'd3-firebase-demo',
  storageBucket: 'd3-firebase-demo.appspot.com',
  messagingSenderId: '278776765108',
  appId: '1:278776765108:web:61ef99f81557e4d086d5e1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
