# Vercel Deployment Guide for 26Club

## Frontend Deployment (Vercel)

### 1. Environment Variables

In your Vercel project settings, add these environment variables:

```
REACT_APP_API_URL=https://marathon-coach-2psl.onrender.com
```

### 2. Build Settings

- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3. Domain Configuration

- Your domain `www.26club.org` is already connected
- Vercel will automatically handle SSL certificates

## Backend Deployment

### Option 1: Vercel (Serverless Functions)

Create `api/` folder in your frontend project:

```javascript
// api/coach.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  // Proxy requests to your backend
  createProxyMiddleware({
    target: "https://your-backend-domain.com",
    changeOrigin: true,
  })(req, res);
};
```

### Option 2: Separate Backend Hosting

Deploy your Flask backend separately on:

- **Railway**: Easy deployment with environment variables
- **Render**: Free tier available
- **Heroku**: Paid but reliable
- **DigitalOcean App Platform**: Good performance

## Environment Variables for Backend

When deploying your backend, set these environment variables:

```bash
FLASK_ENV=production
SECRET_KEY=your-generated-secret-key
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
STRAVA_CLIENT_ID=your-strava-client-id
STRAVA_CLIENT_SECRET=your-strava-client-secret
STRAVA_REFRESH_TOKEN=your-strava-refresh-token
CORS_ORIGINS=https://www.26club.org,https://26club.org
```

## Troubleshooting

### 404 Errors

- The `vercel.json` file should handle client-side routing
- Make sure all routes redirect to `index.html`

### CORS Errors

- Ensure your backend CORS_ORIGINS includes your domain
- Check that the backend is accessible from Vercel

### API Connection Issues

- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Test your backend endpoint directly
- Check backend logs for errors

## Recommended Setup

1. **Frontend**: Deploy on Vercel (already done)
2. **Backend**: Deploy on Railway or Render
3. **Database**: Use a managed database service
4. **Domain**: Point `www.26club.org` to Vercel

## Quick Deploy Commands

```bash
# Frontend (Vercel)
vercel --prod

# Backend (Railway example)
railway login
railway init
railway up
```
