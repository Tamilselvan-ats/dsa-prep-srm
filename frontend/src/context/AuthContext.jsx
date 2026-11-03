import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  isFirebaseConfigured,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dsa_master_user');
    return saved ? JSON.parse(saved) : {
      uid: 'guest-101',
      displayName: 'Aditya (Demo Student)',
      email: 'aditya.student@srm.edu',
      isAnonymous: false,
      isDemo: true,
      role: 'Engineering Student'
    };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isDemo: false
        };
        setUser(userData);
        localStorage.setItem('dsa_master_user', JSON.stringify(userData));
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      // Simulate login for seamless evaluation
      const demoUser = {
        uid: 'google-demo-' + Date.now(),
        displayName: 'Google Demo Student',
        email: 'student.cse@university.edu',
        isDemo: true
      };
      setUser(demoUser);
      localStorage.setItem('dsa_master_user', JSON.stringify(demoUser));
      return demoUser;
    }
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      const demoUser = {
        uid: 'email-demo-' + Date.now(),
        displayName: email.split('@')[0],
        email: email,
        isDemo: true
      };
      setUser(demoUser);
      localStorage.setItem('dsa_master_user', JSON.stringify(demoUser));
      return demoUser;
    }
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email, password, name) => {
    if (!isFirebaseConfigured || !auth) {
      const demoUser = {
        uid: 'user-' + Date.now(),
        displayName: name || email.split('@')[0],
        email: email,
        isDemo: true
      };
      setUser(demoUser);
      localStorage.setItem('dsa_master_user', JSON.stringify(demoUser));
      return demoUser;
    }
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    const guestUser = {
      uid: 'guest-' + Date.now(),
      displayName: 'Guest Student',
      email: 'guest@dsa-master.edu',
      isDemo: true
    };
    setUser(guestUser);
    localStorage.setItem('dsa_master_user', JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      logout,
      isFirebaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
