import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

// Simple in-memory adapter for development
const memoryAdapter = {
  createUser: async (data: any) => ({ id: Date.now().toString(), ...data }),
  getUser: async (id: string) => null,
  getUserByEmail: async (email: string) => null,
  getUserByAccount: async (providerAccountId: any) => null,
  updateUser: async (data: any) => data,
  deleteUser: async (userId: string) => null,
  linkAccount: async (data: any) => data,
  unlinkAccount: async (providerAccountId: any) => null,
  createSession: async (data: any) => data,
  getSessionAndUser: async (sessionToken: string) => null,
  updateSession: async (data: any) => data,
  deleteSession: async (sessionToken: string) => null,
  createVerificationToken: async (data: any) => data,
  useVerificationToken: async (params: any) => null,
};

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: memoryAdapter,
  
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.spacemail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASS
        },
        secure: false, // 587端口使用STARTTLS
        tls: {
          rejectUnauthorized: false
        }
      },
      from: process.env.EMAIL_FROM || 'OldPho <hello@oldpho.com>',
    }),
  ],
  
  session: {
    strategy: 'jwt',
  },
  
  debug: process.env.NODE_ENV === 'development',
}); 