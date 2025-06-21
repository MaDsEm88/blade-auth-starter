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

export type AuthType = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}