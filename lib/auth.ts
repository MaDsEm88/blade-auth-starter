import { betterAuth } from "better-auth"
import { ronin as roninAdapter } from "@ronin/better-auth"
import ronin from 'ronin';

// Get environment variables - Blade 0.9.3+ handles server/client context automatically
const RONIN_TOKEN = process.env["BLADE_RONIN_TOKEN"] || '';
const BETTER_AUTH_SECRET = process.env["BLADE_BETTER_AUTH_SECRET"] || '';
const BETTER_AUTH_URL = process.env["BLADE_BETTER_AUTH_URL"] || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env["BLADE_GOOGLE_CLIENT_ID"] || '';
const GOOGLE_CLIENT_SECRET = process.env["BLADE_GOOGLE_CLIENT_SECRET"] || '';
const GITHUB_CLIENT_ID = process.env["BLADE_GITHUB_CLIENT_ID"] || '';
const GITHUB_CLIENT_SECRET = process.env["BLADE_GITHUB_CLIENT_SECRET"] || '';

// Validate required environment variables
if (!BETTER_AUTH_SECRET) {
  console.warn('BETTER_AUTH_SECRET is not set, using default for development');
}

if (!RONIN_TOKEN) {
  console.warn('RONIN_TOKEN is not set, this may cause database connection issues');
}

const client = ronin({
  token: RONIN_TOKEN,
});

// Helper function to create social provider config only if credentials are available
const createSocialProviders = () => {
  const providers: any = {};
  
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    };
  }
  
  if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    };
  }
  
  return providers;
};

export const auth = betterAuth({
  database: roninAdapter(client),
  secret: BETTER_AUTH_SECRET || 'dev-secret-change-in-production',
  baseURL: BETTER_AUTH_URL,
  socialProviders: createSocialProviders(),
});

export type AuthType = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}