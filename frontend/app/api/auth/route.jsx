// Import NextAuth core function
import NextAuth from "next-auth";

// Import authentication providers
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";

// Create NextAuth handler with configuration
const handler = NextAuth({

  // List of authentication providers (social login options)
  providers: [

    // Google OAuth provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,        // Google Client ID from .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET // Google Client Secret from .env
    }),

    // GitHub OAuth provider configuration
    GitHubProvider({
      clientId: process.env.GITHUB_ID,        // GitHub Client ID from .env
      clientSecret: process.env.GITHUB_SECRET // GitHub Client Secret from .env
    }),

    // Facebook OAuth provider (also used for Instagram via Meta Graph API)
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,        // Facebook App ID
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET // Facebook App Secret
    }),
  ],

  // Custom pages configuration
  pages: {
    signIn: '/login', // Redirect users to custom login page instead of default NextAuth page
  },

  // Callback functions (used to modify token/session behavior)
  callbacks: {

    // Session callback runs whenever a session is checked/created
    async session({ session, token }) {

      // Add user ID from token to session object
      // token.sub contains the user ID (subject)
      session.user.id = token.sub;

      // Return updated session
      return session;
    },
  },
});

// Export handler for both GET and POST requests (required in Next.js App Router)
export { handler as GET, handler as POST };