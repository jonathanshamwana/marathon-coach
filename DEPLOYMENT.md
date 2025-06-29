# 26Club Deployment Guide

## Security Checklist ✅

### Environment Variables

- [ ] Set `FLASK_ENV=production`
- [ ] Generate a strong `SECRET_KEY` (use: `python -c "import secrets; print(secrets.token_hex(32))"`)
- [ ] Configure all Google Cloud credentials
- [ ] Set up Strava API credentials
- [ ] Configure CORS origins for your domain

### API Keys & Credentials

- [ ] Google Cloud Project ID
- [ ] Google Cloud Service Account Key (JSON file)
- [ ] Strava Client ID & Secret
- [ ] Strava Refresh Token

### Security Measures Implemented

- [x] Rate limiting (200 requests/day, 50/hour)
- [x] CORS protection with specific origins
- [x] File upload validation (16MB limit, audio files only)
- [x] Input sanitization
- [x] Error handling without exposing internals
- [x] Production configuration separation

## Deployment Steps

### 1. Environment Setup

```bash
# Copy example environment file
cp backend/env.example backend/.env

# Edit with your actual values
nano backend/.env
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Google Cloud Setup

1. Create a Google Cloud Project
2. Enable required APIs:
   - Speech-to-Text API
   - Text-to-Speech API
   - Vertex AI API
3. Create a Service Account with appropriate permissions
4. Download the JSON key file
5. Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of this file

### 4. Strava API Setup

1. Create a Strava API application
2. Get Client ID and Client Secret
3. Generate a refresh token
4. Add these to your environment variables

### 5. Production Deployment

#### Option A: Using Gunicorn

```bash
cd backend
gunicorn -c gunicorn.conf.py app:app
```

#### Option B: Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-c", "gunicorn.conf.py", "app:app"]
```

### 6. Frontend Deployment

```bash
cd frontend
npm run build
# Deploy the build folder to your hosting service
```

## Security Best Practices

### 1. HTTPS Only

- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use HSTS headers

### 2. Environment Variables

- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly

### 3. API Key Management

- Store Google Cloud credentials securely
- Use IAM roles with minimal permissions
- Monitor API usage and costs

### 4. Monitoring

- Set up logging and monitoring
- Monitor for unusual activity
- Set up alerts for high error rates

### 5. Regular Updates

- Keep dependencies updated
- Monitor for security vulnerabilities
- Regular security audits

## Environment Variables Reference

| Variable                         | Description                          | Required |
| -------------------------------- | ------------------------------------ | -------- |
| `FLASK_ENV`                      | Environment (production/development) | Yes      |
| `SECRET_KEY`                     | Flask secret key                     | Yes      |
| `GOOGLE_CLOUD_PROJECT_ID`        | Google Cloud project ID              | Yes      |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account key          | Yes      |
| `STRAVA_CLIENT_ID`               | Strava API client ID                 | Yes      |
| `STRAVA_CLIENT_SECRET`           | Strava API client secret             | Yes      |
| `STRAVA_REFRESH_TOKEN`           | Strava refresh token                 | Yes      |
| `CORS_ORIGINS`                   | Comma-separated allowed origins      | Yes      |

## Troubleshooting

### Common Issues

1. **CORS errors**: Check `CORS_ORIGINS` configuration
2. **Google Cloud auth**: Verify service account key path and permissions
3. **Strava API errors**: Check refresh token validity
4. **File upload errors**: Verify file size and type restrictions

### Logs

- Check application logs for errors
- Monitor Google Cloud Console for API usage
- Review Strava API rate limits
