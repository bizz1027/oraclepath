import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Auth() {
  const [user, loading] = useAuthState(auth);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
        <span>Sign in with Google</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <img
          src={user.photoURL || ''}
          alt={user.displayName || 'User'}
          className="w-8 h-8 rounded-full"
        />
        <span>{user.displayName}</span>
      </div>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
} 