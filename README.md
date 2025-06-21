# Blade + Better Auth + RONIN Example

A modern, full-stack authentication system built with **Blade React framework**, **Better Auth**, and **RONIN edge database**. This example demonstrates OAuth authentication (Google & GitHub) with session management and dynamic UI updates.

## ✨ Features

- 🔐 **OAuth Authentication** - Google & GitHub sign-in
- 🗄️ **RONIN Edge Database** - Serverless SQLite database
- 🔄 **Session Management** - Secure session handling with Better Auth
- ⚡ **Edge Computing** - Instant loading with edge-first architecture
- 🎨 **Dynamic UI** - Content changes based on authentication status
- 🚀 **Production Ready** - Clean, scalable codebase

## 🛠️ Tech Stack

- **[Blade](https://blade.ronin.co)** - React framework for edge computing
- **[Better Auth](https://better-auth.com)** - Modern authentication library
- **[RONIN](https://ronin.co)** - Edge database with instant global replication
- **[Hono](https://hono.dev)** - Fast web framework for the edge
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework

## 🚀 Quick Start

### Prerequisites

1. **RONIN Account** - [Sign up at ronin.co](https://ronin.co)
2. **Google OAuth App** - [Google Cloud Console](https://console.cloud.google.com)
3. **GitHub OAuth App** - [GitHub Developer Settings](https://github.com/settings/developers)

### 1. Clone & Install

```bash
git clone https://github.com/MaDsEm88/blade-auth-starter.git
cd blade-example
bun install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# RONIN Database
RONIN_TOKEN=your_ronin_app_token

# Better Auth
BETTER_AUTH_SECRET=your_random_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. Database Setup

The RONIN database schema is automatically managed by Better Auth. No manual setup required!

### 4. OAuth Configuration

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### 5. Run Development Server

```bash
bun run dev
```

Visit `http://localhost:3000` and test the authentication flow!

## 📁 Project Structure

```
├── components/
│   └── auth-status.client.tsx    # Dynamic auth status component
├── lib/
│   └── auth.ts                   # Better Auth configuration
├── pages/
│   ├── index.tsx                 # Home page with dynamic content
│   └── auth.tsx                  # Unified sign-in/sign-up page
├── router.ts                     # Hono API routes
└── schema/
    └── index.ts                  # RONIN database schema
```

## 🔧 Configuration Details

### Better Auth Setup

The authentication is configured in `lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth"
import { ronin as roninAdapter } from "@ronin/better-auth"
import ronin from 'ronin';

const client = ronin({
  token: process.env["RONIN_TOKEN"],
})

export const auth = betterAuth({
  database: roninAdapter(client),
  secret: process.env["BETTER_AUTH_SECRET"] as string,
  baseURL: "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env["GOOGLE_CLIENT_ID"] as string,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] as string,
    },
    github: {
      clientId: process.env["GITHUB_CLIENT_ID"] as string,
      clientSecret: process.env["GITHUB_CLIENT_SECRET"] as string,
    },
  },
});
```

### API Routes

The authentication routes are handled in `router.ts`:

- `GET /api/auth/session` - Get current session
- `GET /api/auth/sign-in/google` - Google OAuth redirect
- `GET /api/auth/sign-in/github` - GitHub OAuth redirect
- `GET /api/auth/sign-out` - Sign out user
- `GET /api/auth/callback/*` - OAuth callbacks (handled by Better Auth)

## 🎯 How It Works

1. **User visits homepage** - Shows sign-in options if not authenticated
2. **OAuth flow** - Redirects to Google/GitHub for authentication
3. **Callback handling** - Better Auth processes the OAuth callback
4. **Session creation** - User session stored in RONIN database
5. **Dynamic UI** - Homepage updates to show user information
6. **Sign out** - Clears session and redirects to homepage

## 🚀 Deployment

### Environment Variables for Production

Update your `.env` for production:

```env
BETTER_AUTH_URL=https://your-domain.com
# ... other variables remain the same
```

### OAuth Redirect URIs for Production

Update your OAuth app settings:
- Google: `https://your-domain.com/api/auth/callback/google`
- GitHub: `https://your-domain.com/api/auth/callback/github`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Blade Team](https://blade.im) for the amazing React framework
- [Better Auth](https://better-auth.com) for the authentication library
- [RONIN](https://ronin.co) for the edge database platform
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Support

If this project helped you, please give it a ⭐ on GitHub!
