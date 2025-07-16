# Gmail SMTP Configuration Guide

## Setup Gmail App Password

### 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

### 2. Generate App Password
1. Go to Google Account settings
2. Navigate to Security > 2-Step Verification
3. Click on "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "OldPho" as the name
6. Click "Generate"
7. Copy the 16-character password

### 3. Environment Variables Configuration

Update your `.env` file with the following Gmail settings:

```bash
# Email Configuration for Gmail
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-gmail@gmail.com
EMAIL_SERVER_PASS=your-16-character-app-password
EMAIL_FROM=OldPho <your-gmail@gmail.com>
```

### 4. Important Notes

- **Use App Password**: Never use your regular Gmail password
- **Port 587**: Uses STARTTLS encryption
- **Secure Connection**: The configuration uses TLS encryption
- **Rate Limits**: Gmail has daily sending limits (500 emails/day for regular accounts)

### 5. Testing Configuration

You can test the email configuration using the debug API:

```bash
curl http://localhost:3001/api/debug/email
```

### 6. Troubleshooting

#### Common Issues:

1. **Authentication Failed**
   - Ensure you're using the App Password, not your regular password
   - Verify 2-Factor Authentication is enabled

2. **Connection Timeout**
   - Check if port 587 is blocked by firewall
   - Try using port 465 with SSL (requires different configuration)

3. **Rate Limiting**
   - Gmail has daily sending limits
   - Consider using a business Gmail account for higher limits

### 7. Alternative: Gmail API (Optional)

For higher sending limits, consider using Gmail API instead of SMTP:

```bash
# Gmail API Configuration (Advanced)
GMAIL_CLIENT_ID=your-gmail-api-client-id
GMAIL_CLIENT_SECRET=your-gmail-api-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
```

### 8. Security Best Practices

- Store app passwords securely
- Rotate app passwords regularly
- Monitor email sending logs
- Use environment variables, never hardcode credentials 