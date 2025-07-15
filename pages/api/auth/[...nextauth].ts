import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

// 验证环境变量
const validateConfig = () => {
  const errors = [];
  
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is required');
  }
  
  if (!process.env.NEXTAUTH_URL) {
    errors.push('NEXTAUTH_URL is required');
  }
  
  // 检查是否有至少一个认证提供者
  const hasGoogleProvider = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  const hasEmailProvider = process.env.EMAIL_SERVER && process.env.EMAIL_FROM;
  
  if (!hasGoogleProvider && !hasEmailProvider) {
    errors.push('At least one authentication provider (Google or Email) must be configured');
  }
  
  return errors;
};

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Provider (可选)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    
    // Email Provider (可选)
    ...(process.env.EMAIL_SERVER && process.env.EMAIL_FROM ? [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        maxAge: 24 * 60 * 60, // 链接有效期24小时
      })
    ] : []),
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
};

// 验证配置
const configErrors = validateConfig();
if (configErrors.length > 0) {
  console.error('NextAuth configuration errors:', configErrors);
  throw new Error(`NextAuth configuration errors: ${configErrors.join(', ')}`);
}

export default NextAuth(authOptions);
