# DSA MASTER AI — Complete Deployment & Production Setup Guide

Welcome to the production deployment guide for **DSA MASTER AI**, the premier AI-powered C Data Structures & Algorithms learning and examination preparation platform for engineering students.

---

## 1. Architecture Overview

- **Frontend**: React 18, Vite 6, Tailwind CSS, Framer Motion, React Router 7, Canvas Confetti.
- **Backend**: Node.js, Express.js, Google Generative AI (`@google/generative-ai`), CORS, Dotenv.
- **AI Engine**: Google Gemini API (`gemini-1.5-flash` / Google AI Studio Free Tier).
- **Database & Auth**: Firebase Authentication & Cloud Firestore (with automatic fallback/demo guest mode).

---

## 2. Prerequisites

1. **Node.js**: Version 18.x, 20.x, or 24.x (`node -v`)
2. **npm**: Version 9.x or higher (`npm -v`)
3. **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)
4. **Firebase Project** (Optional for production auth): Created via [Firebase Console](https://console.firebase.google.com/)

---

## 3. Environment Variables Configuration

Create a root `.env` file (or set in your cloud provider environment):

```env
# ========================================================
# BACKEND CONFIGURATION
# ========================================================
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio

# ========================================================
# FRONTEND CONFIGURATION (Vite requires VITE_ prefix)
# ========================================================
VITE_FIREBASE_API_KEY=AIzaSy...your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=dsa-master-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dsa-master-ai
VITE_FIREBASE_STORAGE_BUCKET=dsa-master-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

> [!NOTE]
> If Firebase variables are omitted, DSA MASTER AI automatically activates **Demo Student Mode** so the app remains 100% functional for live grading, visualizers, AI tutor, and lab simulations!

---

## 4. Local Development

### Option A: Running with Root Convenience Scripts
From the repository root:
```bash
# Install all dependencies
npm run install:all

# Start backend (Port 5000)
npm run dev:backend

# In a separate terminal, start frontend (Port 3000)
npm run dev:frontend
```

### Option B: Running Directories Individually

**Backend:**
```bash
cd backend
npm install
npm run dev
# Backend is live at http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Frontend is live at http://localhost:3000
```

---

## 5. Production Build

To test the production build locally:

```bash
cd frontend
npm run build
npm run preview
```
The optimized production bundle will be generated into `frontend/dist/`.

---

## 6. Frontend Deployment Options

### Option 1: Vercel (Recommended)
1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your repository.
4. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables (`VITE_FIREBASE_...`).
6. Click **Deploy**.

### Option 2: Firebase Hosting
1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Authenticate:
   ```bash
   firebase login
   ```
3. Initialize in root or `frontend`:
   ```bash
   firebase init hosting
   ```
   - Public directory: `frontend/dist`
   - Configure as single-page app: `Yes`
   - Automatic builds with GitHub: Optional
4. Deploy:
   ```bash
   cd frontend
   npm run build
   firebase deploy --only hosting
   ```

---

## 7. Backend Deployment Options

### Option 1: Render.com (Free / Easy)
1. Push repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com/).
3. Connect your GitHub repository.
4. Set:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: your Google AI Studio API key
   - `PORT`: `5000`
6. Click **Create Web Service**.

### Option 2: Railway.app
1. Go to [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Set root to `/backend`.
4. Add `GEMINI_API_KEY` variable.
5. Railway provides an HTTPS domain automatically.

---

## 8. Verifying Deployment & Health Checks

Once deployed, visit your backend health endpoint:
```
GET https://your-backend-domain.com/api/health
```
Expected JSON Response:
```json
{
  "status": "online",
  "app": "DSA MASTER AI Backend",
  "geminiConfigured": true,
  "timestamp": "2026-11-03T21:40:00.000Z"
}
```
Now, test:
- **AI DSA Tutor**: Ask "Explain AVL Rotation" to verify 13-part structured output.
- **Visualizers**: Test LinkedList, Stack/Queue, BST, Graph visualizers.
- **Lab Exam Simulator**: Submit a C Queue code snippet and check 10-mark rubric evaluation.
- **Viva Trainer**: Take a 5-question test with Prof. Ramanathan.
