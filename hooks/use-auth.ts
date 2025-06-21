import { useState, useEffect } from 'react';
import { authClient } from '../lib/auth-client';
import type { Session } from '../lib/auth';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setError(null);
        console.log('Fetching session...');

        // Test if the API is reachable
        try {
          const testResponse = await fetch('/api/test');
          console.log('API test response:', testResponse.status);
          if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('API test data:', testData);
          }
        } catch (testError) {
          console.error('API test failed:', testError);
        }

        // Try to get session
        try {
          const sessionResponse = await fetch('/api/auth/session', {
            credentials: 'include'
          });
          console.log('Session response status:', sessionResponse.status);

          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            console.log('Direct session data:', sessionData);
            setSession(sessionData);
          } else {
            console.log('No session found');
            setSession(null);
          }
        } catch (sessionError) {
          console.error('Direct session fetch failed:', sessionError);
          setSession(null);
        }

      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession(null);
        setError(error instanceof Error ? error.message : 'Failed to fetch session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const login = async (provider: 'github' | 'google') => {
    try {
      setError(null);
      setIsLoading(true);

      console.log(`Starting ${provider} login...`);

      // For social login, we need to redirect to the auth endpoint
      const authUrl = `/api/auth/sign-in/${provider}`;
      console.log('Redirecting to:', authUrl);

      // Redirect to the social provider
      window.location.href = authUrl;

    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setSession(null);
            window.location.href = '/';
          }
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: '/dashboard'
      });
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    error,
    login,
    logout,
    signup
  };
}
