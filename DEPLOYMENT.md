# Deployment Guide

This project is best deployed as:

- Backend on Render
- Frontend on Vercel
- Database on MongoDB Atlas

## 1) Backend Deployment (Render)

### Option A: Deploy with Blueprint

1. Push repository to GitHub.
2. In Render, click New + and choose Blueprint.
3. Select your repository.
4. Render will read render.yaml and create the web service.
5. Fill all required environment variables from server/.env.example.
6. Deploy.

### Option B: Deploy manually

1. New Web Service in Render.
2. Root Directory: server
3. Build Command: npm install
4. Start Command: npm start
5. Add environment variables from server/.env.example.
6. Set Health Check Path to /
7. Deploy.

After deploy, copy backend URL:

- Example: https://Tiffinity-api.onrender.com

Your API base URL for frontend should be:

- https://Tiffinity-api.onrender.com/api

## 2) Frontend Deployment (Vercel)

1. Import the same GitHub repository in Vercel.
2. Set Root Directory to client.
3. Framework Preset: Vite (auto-detected in most cases).
4. Add environment variable:
   - VITE_API_URL = https://your-backend-domain.com/api
5. Deploy.

Note:

- client/vercel.json already includes SPA rewrites, so React Router routes work on refresh.

## 3) MongoDB Atlas

1. Ensure your Atlas cluster is active.
2. Use the connection string in MONGO_URI.
3. In Atlas Network Access, allow Render outbound IPs or temporarily allow 0.0.0.0/0 for testing.

## 4) Post-Deployment Smoke Tests

Check backend:

- GET https://your-backend-domain.com/
- Expected: {"message":"Tiffinity API is running"}

Check frontend:

- Open deployed Vercel URL
- Verify login/register and API calls

## 5) Required Environment Variables

Backend (server/.env.example):

- PORT
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRE
- RESEND_API_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- ADMIN_NAME
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_CITY

Frontend (client/.env.example):

- VITE_API_URL

## 6) Common Issues

1. CORS or network errors in frontend:

- Confirm VITE_API_URL ends with /api
- Confirm backend service is running and reachable

2. Database connection fails:

- Verify MONGO_URI
- Verify Atlas IP allowlist

3. Refresh on nested route gives 404:

- Confirm client/vercel.json exists in deployment and contains rewrite to /index.html
