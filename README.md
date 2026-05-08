# Zoronal - Reviewer and Rating Platform

## Overview

Zoronal is a web application for reviewing and rating companies. Users can sign up, log in, view companies, add new companies, and submit reviews.

The repository contains two separate apps:

- `client/` — React frontend
- `server/` — Express backend

---

## Prerequisites

Before running the project, install:

- Node.js v14 or higher
- pnpm or npm
- MongoDB (local or Atlas)
- Git

---

## Frontend Setup

### 1. Install dependencies

```bash
cd client
pnpm install
```

### 2. Configure environment

Create a `.env` in `client/` if it does not exist and set:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the frontend

```bash
pnpm run dev
```

Open the app in a browser at:

```text
http://localhost:5173
```

### 4. PWA configuration

The frontend is configured as a Progressive Web App using `vite-plugin-pwa`.

**PWA Features:**

- Service worker for offline support
- Web app manifest for installability
- Automatic cache management via Workbox
- Runtime caching for API calls

**Install the app:**

- On Chrome/Edge: Click the install icon in the address bar
- On iOS: Use "Add to Home Screen" in Safari
- On Android: Use "Add to Home Screen" in Chrome

**Build and deploy:**

```bash
pnpm build         # Creates dist/ with PWA files
pnpm preview       # Preview the production build locally
```

The app will prompt users to reload when a new version is available. PWA files generated:

- `dist/sw.js` — Service Worker
- `dist/workbox-*.js` — Workbox runtime
- `dist/manifest.webmanifest` — Web app manifest

---

## Backend Setup

### 1. Install dependencies

```bash
cd server
pnpm install
```

### 2. Configure environment

Copy the example environment file and update values:

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zoronal
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_PATH=./uploads
CLIENT_URL=http://localhost:5173
```

If you are using MongoDB Atlas, replace `MONGODB_URI` with your Atlas URI.

### 3. Run the backend

```bash
pnpm run dev
```

The backend will start on:

```text
http://localhost:5000
```

---

## App Usage Guide

### 1. Public routes

Users can access the following without logging in:

- `/login` — log in
- `/signup` — create a new account

### 2. Required auth routes

The main application is protected once auth is enabled. After logging out, users should be redirected back to `/login`.

### 3. User workflow

#### Sign up

1. Open `http://localhost:5173/signup`
2. Enter full name, email, and password
3. Submit the form
4. On success, the app redirects to `/`

#### Log in

1. Open `http://localhost:5173/login`
2. Enter your email and password
3. Submit the form
4. On success, the app redirects to `/`

#### View companies

- The home page shows a company list
- Companies can be filtered by city and sorted by name, rating, reviews, or newest
- Clicking a company opens its detail page

#### Add company

1. Click `+ Add Company`
2. Fill company details:
   - Company name
   - City
   - Description
   - State
   - Country
   - Website
   - Industry
   - Optional logo text
3. Submit to create the company
4. The app navigates to the company detail page

#### Add review

1. Open a company details page
2. Click `+ Add Review`
3. Enter name, rating, and review text
4. Submit the review
5. The review list reloads automatically

#### Logout

- Click `Logout` in the navbar
- The app clears auth state and returns the user to `/login`

---

## API Reference

### Authentication

#### `POST /api/auth/signup`

Create new user.

Body:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### `POST /api/auth/login`

Log in a user.

Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### `GET /api/auth/me`

Get current logged-in user.

#### `POST /api/auth/logout`

Logout endpoint; frontend clears token.

### Companies

#### `GET /api/companies`

List companies.

Query params:

- `search`
- `city`
- `sortBy=name|rating|reviews|newest`

#### `GET /api/companies/:id`

Get one company.

#### `POST /api/companies`

Create a company (authenticated).

#### `GET /api/companies/:id/reviews`

Get reviews for a company.

#### `POST /api/companies/:id/reviews`

Create a company review (authenticated).

---

## Development Notes

### Frontend key files

- `src/main.jsx` — app root and `AuthProvider`
- `src/context/AuthContext.jsx` — auth state management
- `src/services/api.js` — API client
- `src/app/router.jsx` — routes and auth protection
- `src/components/layout/Navbar.jsx` — login/logout navigation
- `src/pages/Home/Home.jsx` — company listing page
- `src/pages/Login/Login.jsx` — login page
- `src/pages/Signup/Signup.jsx` — signup page
- `src/pages/AddCompany/AddCompany.jsx` — add company form
- `src/pages/CompanyDetails/CompanyDetails.jsx` — company detail and reviews

### Backend key files

- `src/server.js` — express app entry
- `src/config/database.js` — MongoDB connection
- `src/controllers/authController.js` — authentication
- `src/controllers/companyController.js` — companies API
- `src/routes/authRoutes.js` — auth routing
- `src/routes/companyRoutes.js` — company routing
- `src/utils/tokenUtils.js` — JWT token creation
- `src/middleware/auth.js` — route auth guard

---

## Troubleshooting

- If login/logout state does not update, restart both frontend and backend.
- If API calls fail, ensure `server` is running and `VITE_API_URL` points to `http://localhost:5000/api`.
- If MongoDB cannot connect, verify the `MONGODB_URI` in `server/.env`.

---

## Deployment

### Frontend (Vercel)

**Prerequisites:**
- Push code to GitHub
- Create Vercel account at https://vercel.com

**Steps:**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` = your backend API URL (e.g., `https://your-api.com/api`)
3. Vercel auto-deploys on git push
4. PWA files are automatically generated during build

**Example backend URL for Vercel deployment:**
```env
VITE_API_URL=https://zoronal-api.vercel.app/api
```

### Backend (Deployment platform)

**Environment variables to set in production:**

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/zoronal
JWT_SECRET=<strong-random-key>
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Important for production:**
- Set `JWT_SECRET` to a long random string
- Use MongoDB Atlas for cloud database
- Update `CLIENT_URL` to match your frontend domain
- Set `NODE_ENV=production`

### CORS configuration

The backend automatically handles:
- Multiple origin URLs via comma-separated `CLIENT_URL`
- Vercel preview URLs
- localhost for development

Example `CLIENT_URL` for multiple environments:
```env
CLIENT_URL=http://localhost:5173,https://zoronal.vercel.app
```

