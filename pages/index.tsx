import { AuthStatus } from '../components/auth-status.client';

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to Your Blade App
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            A modern authentication system with Better Auth + RONIN
          </p>

          {/* Dynamic Authentication Status */}
          <div className="mt-8">
            <AuthStatus />
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">How It Works</h3>
            <div className="text-sm text-left space-y-2">
              <p>✅ <strong>OAuth Authentication:</strong> Sign in with Google or GitHub</p>
              <p>✅ <strong>Session Management:</strong> Secure session handling with Better Auth</p>
              <p>✅ <strong>RONIN Database:</strong> User data stored in RONIN edge database</p>
              <p>✅ <strong>Dynamic UI:</strong> Content changes based on authentication status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;