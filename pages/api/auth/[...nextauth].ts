import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    EmailProvider({
      server: 'smtp://user:pass@smtp.example.com:587',
      from: 'noreply@example.com',
    }),
  ],
  
  session: {
    strategy: 'jwt',
  },
}); 