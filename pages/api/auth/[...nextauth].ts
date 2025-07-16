import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    
    EmailProvider({
      server: process.env.EMAIL_SERVER || 'smtp://user:pass@smtp.example.com:587',
      from: process.env.EMAIL_FROM || 'noreply@example.com',
    }),
  ],
  
  debug: true,
  
  session: {
    strategy: 'jwt',
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
});
