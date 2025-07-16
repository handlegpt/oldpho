import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    // 只保留邮箱登录
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
