import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Setting up auth state observer');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setError('');
      console.log('Attempting to create user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error in signup:', error.code, error.message);
      setError(error.message);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      setError('');
      console.log('Attempting to sign in user with email:', email);
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error in login:', error.code, error.message);
      setError(error.message);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      console.log('Attempting Google sign in');
      const result = await signInWithGoogle();
      console.log('Google sign in successful');
      return result;
    } catch (error) {
      console.error('Error in Google sign in:', error.code, error.message);
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError('');
      console.log('Attempting to sign out');
      await signOut(auth);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error in logout:', error.code, error.message);
      setError(error.message);
      throw error;
    }
  };

  const value = {
    currentUser,
    error,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  console.log('AuthProvider state:', { currentUser, loading, error }); // Debug log

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 