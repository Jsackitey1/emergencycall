// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBONtpC4YL7SpzPZBR133wejED7VXUG5pQ",
  authDomain: "emergencycall-d257b.firebaseapp.com",
  projectId: "emergencycall-d257b",
  storageBucket: "emergencycall-d257b.firebasestorage.app",
  messagingSenderId: "967333233350",
  appId: "1:967333233350:web:ad79627799c259b54e0dc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Set session persistence instead of local persistence
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log('Session persistence set successfully');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Google Sign In function
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export { auth, googleProvider, signInWithGoogle };
export default app;