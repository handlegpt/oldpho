import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

// 动态获取NEXTAUTH_URL
const getNextAuthUrl = () => {
  // 如果环境变量中有NEXTAUTH_URL，使用它
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // 否则根据环境推断
  if (process.env.NODE_ENV === 'production') {
    return 'https://oldpho.com';
  }
  
  return 'http://localhost:3001';
};

// 验证配置
const validateConfig = () => {
  const errors = [];
  
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is required');
  }
  
  if (!process.env.NEXTAUTH_URL) {
    errors.push('NEXTAUTH_URL is required');
  }
  
  return errors;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    // Google Provider (可选)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    
    // Email Provider (始终包含)
    EmailProvider({
      server: process.env.EMAIL_SERVER || 'smtp://user:pass@smtp.example.com:587',
      from: process.env.EMAIL_FROM || 'noreply@example.com',
    }),
  ],
  
  debug: process.env.NODE_ENV === 'development',
  
  session: {
    strategy: 'jwt',
  },
  
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 确保重定向URL安全
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
};

// 验证配置
const configErrors = validateConfig();
if (configErrors.length > 0) {
  console.error('NextAuth configuration errors:', configErrors);
}

export default NextAuth(authOptions);
