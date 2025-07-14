import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismadb';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  // 调试模式
  debug: process.env.NODE_ENV === 'development',
  
  // 会话配置
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // JWT 配置
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // 回调函数
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn callback:', { user: user?.email, account: account?.provider });
      return true;
    },
    async session({ session, user, token }) {
      console.log('Session callback:', { user: user?.email, token: token?.email });
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log('JWT callback:', { user: user?.email, account: account?.provider });
      return token;
    },
  },
  
  // 错误处理
  events: {
    async signIn(message) {
      console.log('SignIn event:', message);
    },
    async signOut(message) {
      console.log('SignOut event:', message);
    },
    async error(message) {
      console.error('Auth error:', message);
    },
  },
  
  // 页面配置
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
};

export default NextAuth({
  ...authOptions,
});
