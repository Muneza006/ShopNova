# Google OAuth2 Login Setup

## Step 1: Create Google OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Application type: "Web application"
7. Add authorized redirect URIs:
   - http://localhost:8080/login/oauth2/code/google
   - http://localhost:8080/oauth2/authorization/google

## Step 2: Update application.yaml

Replace in `src/main/resources/application.yaml`:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_GOOGLE_CLIENT_ID
            client-secret: YOUR_GOOGLE_CLIENT_SECRET
```

## Step 3: Restart Backend

```bash
mvn spring-boot:run
```

## Step 4: Test

1. Click "Sign in with Google" button
2. Select Google account
3. Grant permissions
4. Redirects back to app logged in

## Note

- Keep client secret secure
- Never commit credentials to Git
- Use environment variables in production
