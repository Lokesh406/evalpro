# EvalPro - Deployment Guide

## Local Setup

### Prerequisites
- Node.js v16+
- npm

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-gmail-app-password
PORT=3001
```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd evalpro
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd evalpro
npm run dev
```

Access app at: http://localhost:5173/evalpro/

---

## Deployment to Production

### Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED

#### 1. Frontend - Vercel
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repo
4. Build settings auto-detect (Vite)
5. Deploy ✅

**After deployment, note your Vercel URL** (e.g., `https://evalpro.vercel.app`)

#### 2. Backend - Railway
1. Go to https://railway.app
2. Create new project → GitHub repo
3. Set environment variables:
   - `GMAIL_USER` - your email
   - `GMAIL_PASS` - app password
   - `PORT` - 3001

4. Build: `npm install`
5. Start: `node server.js`
6. Deploy ✅

**After deployment, note your Railway URL** (e.g., `https://evalpro-prod.up.railway.app`)

#### 3. Update Frontend to Use Production Backend
In `src/components/EmailExportModal.jsx`, replace:
```javascript
const response = await fetch("http://localhost:3001/api/send-email", {
```

With:
```javascript
const response = await fetch("https://your-railway-url.railway.app/api/send-email", {
```

Re-deploy Vercel after this change.

---

### Option 2: Render (Full Stack)
1. Go to https://render.com
2. Create Web Service from GitHub
3. Build: `npm install`
4. Start: `npm run server` (requires npm script setup)
5. Add env vars (GMAIL_USER, GMAIL_PASS)
6. Deploy backend separately

---

## GitHub Push

```bash
# From root directory
git status
git add .
git commit -m "Add env config, prepare for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/evalpro.git
git push -u origin main
```

**Note:** If using HTTPS, use a Personal Access Token (PAT) as password.

---

## Important Security Notes

⚠️ **Never commit `.env` file** - it's in `.gitignore`
⚠️ **Gmail App Passwords** - Create one specifically for this app at https://myaccount.google.com/apppasswords
⚠️ **Rotate credentials** periodically

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `GMAIL_USER` | Gmail account for sending emails | `your@gmail.com` |
| `GMAIL_PASS` | Gmail app password (NOT regular password) | `xxxx xxxx xxxx xxxx` |
| `PORT` | Backend server port | `3001` |
| `NODE_ENV` | Environment mode | `production` / `development` |

---

## Troubleshooting

**"Backend not running"**
- Ensure backend URL is correct in frontend
- Check Railway/hosting logs

**"Invalid login"**
- Gmail credentials in `.env` incorrect
- Generate new app password

**Emails not sending**
- Check GMAIL_USER and GMAIL_PASS in production env vars
- Verify Gmail account has 2FA enabled
- Check deployment platform logs

