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

// 获取邮件语言内容
const getEmailContent = (email: string, url: string) => {
  // 根据邮箱域名判断语言偏好
  const domain = email.split('@')[1]?.toLowerCase();
  
  // 中文邮箱域名
  const chineseDomains = ['qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'yeah.net', 'gmail.com'];
  // 日文邮箱域名
  const japaneseDomains = ['yahoo.co.jp', 'docomo.ne.jp', 'ezweb.ne.jp', 'softbank.ne.jp'];
  
  if (chineseDomains.includes(domain)) {
    return {
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
    };
  } else if (japaneseDomains.includes(domain)) {
    return {
      subject: 'OldPho - ログイン認証',
      text: `OldPhoにログインするには、以下のリンクをクリックしてください：\n\n${url}\n\nこのメールをリクエストしていない場合は、無視してください。`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OldPho ログイン認証</h2>
          <p>下のボタンをクリックしてアカウントにログインしてください：</p>
          <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">OldPhoにログイン</a>
          <p>または、以下のリンクをブラウザにコピーしてください：</p>
          <p style="word-break: break-all; color: #666;">${url}</p>
          <p style="color: #999; font-size: 12px;">このメールをリクエストしていない場合は、無視してください。</p>
        </div>
      `
    };
  } else {
    // 默认英文
    return {
      subject: 'OldPho - Login Verification',
      text: `Click the following link to sign in to OldPho:\n\n${url}\n\nIf you didn't request this email, please ignore it.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OldPho Login Verification</h2>
          <p>Click the button below to sign in to your account:</p>
          <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Sign in to OldPho</a>
          <p>Or copy the following link to your browser:</p>
          <p style="word-break: break-all; color: #666;">${url}</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this email, please ignore it.</p>
        </div>
      `
    };
  }
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
        host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASS
        },
        secure: false, // 587端口使用STARTTLS
        tls: {
          rejectUnauthorized: false
        },
        requireTLS: true,
        connectionTimeout: 60000, // 60秒超时
        greetingTimeout: 60000,
        socketTimeout: 60000
      },
      from: process.env.EMAIL_FROM || 'OldPho <hello@oldpho.com>',
      maxAge: 10 * 60, // 10分钟
      sendVerificationRequest: async ({ identifier, url, provider }: any) => {
        console.log('Sending verification email to:', identifier);
        console.log('Email URL:', url);
        
        try {
          const { server, from } = provider;
          const nodemailer = require('nodemailer');
          
          const transport = nodemailer.createTransport(server);
          
          // 验证连接
          console.log('Verifying transporter connection...');
          await transport.verify();
          console.log('Transporter verified successfully');
          
          // 根据邮箱获取多语言内容
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
    error(code: any, ...message: any[]) {
      console.error('NextAuth Error:', code, ...message);
    },
    warn(code: any, ...message: any[]) {
      console.warn('NextAuth Warning:', code, ...message);
    },
    debug(code: any, ...message: any[]) {
      console.log('NextAuth Debug:', code, ...message);
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
  }
});

// 验证配置
validateEmailConfig(); 