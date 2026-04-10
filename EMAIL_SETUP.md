# Email Setup Instructions for ShopNova

To enable email notifications when users register, you need to configure Gmail SMTP:

## Step 1: Enable 2-Factor Authentication on Gmail
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"

## Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Click "Generate"
4. Copy the 16-character password

## Step 3: Update application.yaml
Replace these values in `src/main/resources/application.yaml`:

```yaml
spring:
  mail:
    username: your-actual-email@gmail.com
    password: your-16-char-app-password
```

## Step 4: Restart Backend
```bash
mvn spring-boot:run
```

## Testing
1. Register a new user with a real email
2. Check the email inbox for welcome message
3. If email doesn't arrive, check spam folder

## Alternative: Disable Email (For Development)
If you don't want to set up email now, the app will still work.
Failed emails are logged but won't stop registration.

## Note
- Never commit real email credentials to Git
- Use environment variables in production
- Gmail allows 500 emails per day for free accounts
