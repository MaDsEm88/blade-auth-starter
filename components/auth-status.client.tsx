import  { useState, useEffect } from 'react';
import { Link, Image } from 'blade/client/components';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: string;
}

interface AuthData {
  user: User | null;
  session: Session | null;
  error?: string;
}

export const AuthStatus: React.FC = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Add cache-busting timestamp to force fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/auth/session?t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();

      // Force a complete state update
      setAuthData(null); // Clear first
      setTimeout(() => setAuthData(data), 0); // Then set new data
    } catch (error) {
      setAuthData({ user: null, session: null, error: 'Failed to check auth' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for focus events to refresh when user returns to tab
    // (useful if they complete OAuth in another tab)
    const handleFocus = () => {
      checkAuth();
    };

    // Listen for storage events (if using localStorage for session sync)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!authData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        <p className="text-red-600">Failed to load authentication status</p>
      </div>
    );
  }

  if (authData.user) {
    // User is authenticated - show welcome message and user info
    return (
      <div key={authData.user.id} className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-green-600">Welcome back!</h2>

        <div className="space-y-4">
          {/* User Avatar */}
          {authData.user.image && (
            <div className="flex justify-center">
              <Image
                key={`${authData.user.id}-${authData.user.image}`} // Force re-render when user changes
                src={authData.user.image}
                alt={authData.user.name}
                className="w-16 h-16 rounded-full border-2 border-gray-200"
                width={64}
                height={64}
              />
            </div>
          )}
          
          {/* User Info */}
          <div className="text-center space-y-2">
            <p className="font-medium text-gray-900">
              {authData.user.name}
            </p>
            <p className="text-sm text-gray-600">
              {authData.user.email}
            </p>
          </div>
          
          {/* Actions */}
          <div className="space-y-2 pt-4 border-t">
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  await fetch('/api/auth/sign-out');
                  // Immediately refresh the auth status
                  await checkAuth();
                } catch (error) {
                  setLoading(false);
                }
              }}
              className="block w-full cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-center"
            >
              Sign Out
            </button>

           
          </div>
        </div>
      </div>
    );
  } else {
    // User is not authenticated - show sign in options
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Get Started</h2>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Sign in to access your account and enjoy all features.
          </p>
          
          <div className="space-y-2">
            <Link href="/auth">
              <a className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
                Sign In / Sign Up
              </a>
            </Link>

          
          </div>
        </div>
      </div>
    );
  }
};
