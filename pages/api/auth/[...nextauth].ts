import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // 链接有效期24小时
    }),
  ],
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
  
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Callback functions
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      console.log('SignIn callback:', { user: user?.email, account: account?.provider });
      return true;
    },
    async session({ session, user, token }: any) {
      console.log('Session callback:', { user: user?.email, token: token?.email });
      return session;
    },
    async jwt({ token, user, account, profile }: any) {
      console.log('JWT callback:', { user: user?.email, account: account?.provider });
      return token;
    },
    async redirect({ url, baseUrl }: any) {
      console.log('Redirect callback:', { url, baseUrl });
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  
  // Event handlers
  events: {
    async signIn(message: any) {
      console.log('SignIn event:', message);
    },
    async signOut(message: any) {
      console.log('SignOut event:', message);
    },
  },
  
  // Page configuration
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
};

export default NextAuth(authOptions);
