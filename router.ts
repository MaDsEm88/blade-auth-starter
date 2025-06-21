import { Hono } from "hono";
import { auth } from "./lib/auth";
import { cors } from "hono/cors";
import { ronin } from "@ronin/hono";

const app = new Hono();

// Add RONIN middleware with explicit token
app.use("*", ronin({
  token: process.env["RONIN_TOKEN"] as string
}));

// Configure CORS for all routes (Better Auth needs this)
app.use(
  "*",
  cors({
    origin: process.env["BETTER_AUTH_URL"] || "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);


// Manual session route
app.get("/api/auth/session", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (session) {
      return c.json({
        user: session.user,
        session: session.session
      });
    } else {
      return c.json({ user: null, session: null });
    }
  } catch (error) {
    return c.json({
      user: null,
      session: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Manual social sign-in routes - redirect to OAuth URLs
app.get("/api/auth/sign-in/google", async (c) => {
  try {
    const result = await auth.api.signInSocial({
      body: { provider: "google" },
      headers: c.req.raw.headers,
      asResponse: true
    });

    if (result.status === 200) {
      const data = await result.json();
      if (data.url) {
        return c.redirect(data.url);
      }
    }

    return result;
  } catch (error) {
    return c.json({
      error: 'Google sign-in failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

app.get("/api/auth/sign-in/github", async (c) => {
  try {
    const result = await auth.api.signInSocial({
      body: { provider: "github" },
      headers: c.req.raw.headers,
      asResponse: true
    });

    if (result.status === 200) {
      const data = await result.json();
      if (data.url) {
        return c.redirect(data.url);
      }
    }

    return result;
  } catch (error) {
    return c.json({
      error: 'GitHub sign-in failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Sign out route
app.get("/api/auth/sign-out", async (c) => {
  try {
    const result = await auth.api.signOut({
      headers: c.req.raw.headers,
      asResponse: true
    });

    // Redirect to home page after sign out
    if (result.status === 200) {
      return c.redirect('/');
    }

    return result;
  } catch (error) {
    return c.json({
      error: 'Sign out failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

app.on(["POST", "GET"], "/api/auth/*", async (c) => {
  try {
    const response = await auth.handler(c.req.raw);
    return response;
  } catch (error) {
    return c.json({
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;
