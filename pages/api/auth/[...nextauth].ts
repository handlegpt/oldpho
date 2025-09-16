import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismadb';

// Get email content based on language preference
const getEmailContent = (email: string, url: string) => {
  const domain = email.split('@')[1]?.toLowerCase();
  
  const chineseDomains = ['qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'yeah.net', 'gmail.com'];
  const japaneseDomains = ['yahoo.co.jp', 'docomo.ne.jp', 'ezweb.ne.jp', 'softbank.ne.jp'];
  
  if (chineseDomains.includes(domain)) {
    return {
      subject: 'Shin AI - 登录验证',
      text: `请点击以下链接登录 Shin AI：\n\n${url}\n\n如果您没有请求此邮件，请忽略。`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Shin AI 登录验证</h2>
          <p>请点击下面的按钮登录您的账户：</p>
          <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">登录 Shin AI</a>
          <p>或者复制以下链接到浏览器：</p>
          <p style="word-break: break-all; color: #666;">${url}</p>
          <p style="color: #999; font-size: 12px;">如果您没有请求此邮件，请忽略。</p>
        </div>
      `
    };
  } else if (japaneseDomains.includes(domain)) {
    return {
      subject: 'Shin AI - ログイン認証',
      text: `Shin AIにログインするには、以下のリンクをクリックしてください：\n\n${url}\n\nこのメールをリクエストしていない場合は、無視してください。`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Shin AI ログイン認証</h2>
          <p>下のボタンをクリックしてアカウントにログインしてください：</p>
          <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Shin AIにログイン</a>
          <p>または、以下のリンクをブラウザにコピーしてください：</p>
          <p style="word-break: break-all; color: #666;">${url}</p>
          <p style="color: #999; font-size: 12px;">このメールをリクエストしていない場合は、無視してください。</p>
        </div>
      `
    };
  } else {
    return {
      subject: 'Shin AI - Login Verification',
      text: `Click the following link to sign in to Shin AI:\n\n${url}\n\nIf you didn't request this email, please ignore it.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Shin AI Login Verification</h2>
          <p>Click the button below to sign in to your account:</p>
          <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Sign in to Shin AI</a>
          <p>Or copy the following link to your browser:</p>
          <p style="word-break: break-all; color: #666;">${url}</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this email, please ignore it.</p>
        </div>
      `
    };
  }
};

// Validate email configuration
const validateEmailConfig = () => {
  const required = ['EMAIL_SERVER_HOST', 'EMAIL_SERVER_USER', 'EMAIL_SERVER_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Email configuration incomplete:', missing);
    console.warn('Email login will be disabled. Please configure email settings to enable email login.');
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

// Validate Google OAuth configuration
const validateGoogleConfig = () => {
  const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Google OAuth not configured:', missing);
    return false;
  }
  
  console.log('Google OAuth configuration validated');
  return true;
};

// Configure providers
const providers = [];

// Add Email provider
if (validateEmailConfig()) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASS
        },
        secure: false,
        tls: {
          rejectUnauthorized: false
        },
        requireTLS: true,
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000
      },
      from: process.env.EMAIL_FROM || 'Shin AI <hello@shinai.com>',
      maxAge: 10 * 60, // 10 minutes
      sendVerificationRequest: async ({ identifier, url, provider }: any) => {
        console.log('Sending verification email to:', identifier);
        
        try {
          const { server, from } = provider;
          const nodemailer = require('nodemailer');
          
          const transport = nodemailer.createTransport(server);
          
          console.log('Verifying transporter connection...');
          await transport.verify();
          console.log('Transporter verified successfully');
          
          const emailContent = getEmailContent(identifier, url);
          
          const result = await transport.sendMail({
            to: identifier,
            from,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
          });
          
          console.log('Email sent successfully:', result.messageId);
          return result;
        } catch (error: any) {
          console.error('Email sending failed:', error);
          
          // 提供更详细的错误信息
          if (error.code === 'EAUTH') {
            throw new Error('Email authentication failed. Please check your email credentials.');
          } else if (error.code === 'ECONNECTION') {
            throw new Error('Unable to connect to email server. Please check your network connection.');
          } else if (error.code === 'ETIMEDOUT') {
            throw new Error('Email server connection timed out. Please try again later.');
          } else {
            throw new Error(`Email sending failed: ${error.message}`);
          }
        }
      }
    })
  );
}

// Add Google OAuth provider if configured
if (validateGoogleConfig()) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers,
  
  session: {
    strategy: 'jwt' as const,
  },
  
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code: any, ...message: any[]) {
      console.error('NextAuth Error:', code, ...message);
    },
    warn(code: any, ...message: any[]) {
      console.warn('NextAuth Warning:', code, ...message);
    },
    debug(code: any, ...message: any[]) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, ...message);
      }
    }
  },
  
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      console.log('SignIn callback:', { user: user?.email, account: account?.provider });
      return true;
    },
    async jwt({ token, user, account, profile }: any) {
      console.log('JWT callback:', { user: user?.email, token: token?.email });
      return token;
    },
    async session({ session, token, user }: any) {
      console.log('Session callback:', { user: session?.user?.email });
      return session;
    }
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }: any) {
      console.log('User signed in:', user.email);
    },
    async signOut({ session, token }: any) {
      console.log('User signed out');
    },
    async createUser({ user }: any) {
      console.log('New user created:', user.email);
    },
    async linkAccount({ user, account, profile }: any) {
      console.log('Account linked:', user.email);
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
};

export default NextAuth(authOptions);

// Validate configuration on startup
validateEmailConfig();
validateGoogleConfig(); 