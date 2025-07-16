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

// 验证邮箱配置
const validateEmailConfig = () => {
  const required = ['EMAIL_SERVER_HOST', 'EMAIL_SERVER_USER', 'EMAIL_SERVER_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing email configuration:', missing);
    return false;
  }
  
  console.log('Email configuration validated:', {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    user: process.env.EMAIL_SERVER_USER,
    from: process.env.EMAIL_FROM
  });
  
  return true;
};

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: memoryAdapter,
  
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.spacemail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASS
        },
        secure: true, // 465端口使用SSL
        tls: {
          rejectUnauthorized: false
        },
        requireTLS: true,
        connectionTimeout: 30000, // 30秒超时
        greetingTimeout: 30000,
        socketTimeout: 30000
      },
      from: process.env.EMAIL_FROM || 'OldPho <hello@oldpho.com>',
      maxAge: 10 * 60, // 10分钟
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        console.log('Sending verification email to:', identifier);
        console.log('Email URL:', url);
        console.log('Provider config:', {
          host: provider.server.host,
          port: provider.server.port,
          user: provider.server.auth.user,
          secure: provider.server.secure
        });
        
        try {
          const { server, from } = provider;
          const nodemailer = require('nodemailer');
          
          console.log('Creating transporter with config:', {
            host: server.host,
            port: server.port,
            secure: server.secure,
            auth: { user: server.auth.user, pass: '***' }
          });
          
          const transport = nodemailer.createTransport(server);
          
          // 验证连接
          console.log('Verifying transporter connection...');
          await transport.verify();
          console.log('Transporter verified successfully');
          
          const result = await transport.sendMail({
            to: identifier,
            from,
            subject: 'OldPho - 登录验证',
            text: `请点击以下链接登录 OldPho：\n\n${url}\n\n如果您没有请求此邮件，请忽略。`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">OldPho 登录验证</h2>
                <p>请点击下面的按钮登录您的账户：</p>
                <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">登录 OldPho</a>
                <p>或者复制以下链接到浏览器：</p>
                <p style="word-break: break-all; color: #666;">${url}</p>
                <p style="color: #999; font-size: 12px;">如果您没有请求此邮件，请忽略。</p>
              </div>
            `
          });
          
          console.log('Email sent successfully:', result.messageId);
          return result;
        } catch (error) {
          console.error('Email sending failed:', error);
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            command: error.command
          });
          throw error;
        }
      }
    }),
  ],
  
  session: {
    strategy: 'jwt',
  },
  
  debug: true, // 启用调试模式
  logger: {
    error(code, ...message) {
      console.error('NextAuth Error:', code, ...message);
    },
    warn(code, ...message) {
      console.warn('NextAuth Warning:', code, ...message);
    },
    debug(code, ...message) {
      console.log('NextAuth Debug:', code, ...message);
    }
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email);
    },
    async signOut({ session, token }) {
      console.log('User signed out');
    },
    async createUser({ user }) {
      console.log('New user created:', user.email);
    },
    async linkAccount({ user, account, profile }) {
      console.log('Account linked:', user.email);
    }
  }
});

// 验证配置
validateEmailConfig(); 