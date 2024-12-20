import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA4xO8XAJeCJzNv_Y3ocJlNFjcWyG7D7f0",
  authDomain: "shagun-ecc3e.firebaseapp.com",
  projectId: "shagun-ecc3e",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("app", process.env.FIREBASE_API_KEY);
export const auth = getAuth(app);