import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name:string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  getToken: (forceRefresh?: boolean) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set up Firebase auth state observer
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {


      console.log("firebaseUser", firebaseUser);
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      
      // Only set loading to false after we've handled the auth state
      setIsLoading(false);
      
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
     await signInWithEmailAndPassword(auth, email, password);
     
     
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/login');
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getToken = async (forceRefresh: boolean = false) => {
    try {
      if (!auth.currentUser) {
        return null;
      }
      return await auth.currentUser.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      isAuthenticated, 
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    default:
      return 'An error occurred during authentication';
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};