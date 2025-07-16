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
      server: process.env.EMAIL_SERVER || 'smtp://user:pass@smtp.example.com:587',
      from: process.env.EMAIL_FROM || 'noreply@example.com',
    }),
  ],
  
  session: {
    strategy: 'jwt',
  },
  
  debug: process.env.NODE_ENV === 'development',
}); 