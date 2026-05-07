# Zoronal - Complete Setup Guide

This guide will help you set up and run the complete Zoronal application (frontend and backend).

## Project Structure

```
zoronal/
├── client/          # React frontend
└── server/          # Express.js backend
```

## Prerequisites

- **Node.js** v14 or higher
- **MongoDB** (local or cloud instance)
- **npm** or **pnpm** package manager
- **Git**

## Setup Instructions

### 1. MongoDB Setup

#### Option A: Local MongoDB

Install MongoDB Community Edition:
- **Windows**: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- **macOS**: `brew install mongodb-community`
- **Linux**: https://docs.mongodb.com/manual/administration/install-on-linux/

Start MongoDB:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file with your connection string

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install
# or
pnpm install

# Create .env file
cp .env.example .env
```

**Configure `.env` file:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zoronal
JWT_SECRET=your_very_secure_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_PATH=./uploads
```

**Important**: Change `JWT_SECRET` to a strong random string in production.

**Start the backend:**

```bash
# Development (with hot reload)
pnpm run dev

# Production
pnpm start
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install
# or
pnpm install

# Create .env file
cp .env.example .env
```

**Configure `.env` file:**

```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
pnpm run dev
```

The frontend will start on `http://localhost:5173` (or similar)

## Testing the Application

### 1. Create Test User

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create Company

```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=TechCorp" \
  -F "description=A leading tech company" \
  -F "city=Indore" \
  -F "state=Madhya Pradesh" \
  -F "country=India" \
  -F "website=https://techcorp.com" \
  -F "email=info@techcorp.com" \
  -F "phone=+91-8888888888" \
  -F "industry=Technology" \
  -F "logo=@/path/to/logo.png"
```

### 4. Get Companies

```bash
curl http://localhost:5000/api/companies
```

### 5. Access Application

Open browser and navigate to `http://localhost:5173`

## Frontend Integration

The frontend automatically integrates with the backend through:

1. **API Service** (`src/services/api.js`): Handles all API calls
2. **Auth Context** (`src/context/AuthContext.jsx`): Manages authentication state
3. **Protected Routes**: Automatically redirect to login if not authenticated

### Using Auth in Components

```jsx
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.fullName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login first</p>
      )}
    </div>
  )
}
```

### Making API Calls

```jsx
import api from '@/services/api'

// Get all companies
const companies = await api.getAllCompanies()

// Create company
const newCompany = await api.createCompany({
  name: 'Company Name',
  description: 'Description',
  city: 'City'
}, logoFile)

// Update user profile
await api.updateProfile('New Name', 'newemail@example.com')
```

## Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (URL),
  role: String ('user' or 'admin'),
  isActive: Boolean,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Companies Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  logo: String (URL),
  logoText: String,
  city: String,
  state: String,
  country: String,
  website: String,
  email: String,
  phone: String,
  industry: String,
  rating: Number (0-5),
  reviewsCount: Number,
  createdBy: ObjectId (User),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Notes

1. **JWT Secret**: Always use a strong, random secret in production
2. **HTTPS**: Use HTTPS in production (not HTTP)
3. **CORS**: Configure CORS properly for production domains
4. **Rate Limiting**: Login attempts are limited to prevent brute force
5. **Password Hashing**: All passwords are hashed with bcryptjs
6. **File Upload**: Only image files allowed (5MB max)

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running. Check your `MONGODB_URI` in `.env`.

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure `VITE_API_URL` in frontend `.env` matches backend URL.

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change `PORT` in `.env` or kill the process using the port.

### Token Expired
**Solution**: User needs to login again. Clear localStorage and reload.

## API Documentation

Full API documentation is available at [server/README.md](server/README.md)

## Deployment

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables in deployment settings
4. Deploy

### Backend (Heroku/Railway)
1. Add `Procfile`:
```
web: pnpm start
```
2. Deploy using platform CLI or connect to GitHub

## Future Features

- [ ] Email verification
- [ ] Password reset
- [ ] Company reviews
- [ ] Advanced filtering
- [ ] Admin dashboard
- [ ] Analytics

## Support

For issues and questions, check the README files in each folder.

## License

ISC
