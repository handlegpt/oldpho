import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 验证环境变量
    const required = ['EMAIL_SERVER_HOST', 'EMAIL_SERVER_USER', 'EMAIL_SERVER_PASS'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      return res.status(400).json({ 
        error: 'Missing email configuration', 
        missing 
      });
    }

    // 创建 SMTP 配置
    const smtpConfig = {
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASS
      },
      secure: false,
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      requireTLS: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    };

    console.log('Testing SMTP configuration:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user,
      secure: smtpConfig.secure
    });

    // 创建传输器
    const transporter = nodemailer.createTransporter(smtpConfig);

    // 验证连接
    await transporter.verify();

    // 发送测试邮件
    const testEmail = req.body.email || process.env.EMAIL_SERVER_USER;
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'OldPho <hello@oldpho.com>',
      to: testEmail,
      subject: 'OldPho - 邮箱连接测试',
      text: '这是一封测试邮件，用于验证邮箱配置是否正确。',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OldPho 邮箱连接测试</h2>
          <p>恭喜！邮箱配置正确，可以正常发送邮件。</p>
          <p>时间：${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log('Test email sent successfully:', result.messageId);

    return res.status(200).json({
      success: true,
      message: 'Email configuration is working correctly',
      messageId: result.messageId,
      config: {
        host: smtpConfig.host,
        port: smtpConfig.port,
        user: smtpConfig.auth.user,
        secure: smtpConfig.secure
      }
    });

  } catch (error) {
    console.error('Email test failed:', error);
    
    return res.status(500).json({
      error: 'Email configuration test failed',
      details: error.message,
      code: error.code
    });
  }
} 