# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)

### Step 1: Install Backend
```bash
cd server
pnpm install
```

### Step 2: Setup Backend Environment
```bash
# Copy example .env
cp .env.example .env

# Update .env with your MongoDB URI
# If using local MongoDB, default is fine: mongodb://localhost:27017/zoronal
```

### Step 3: Start Backend
```bash
pnpm run dev
# Server runs on http://localhost:5000
```

### Step 4: Install Frontend
```bash
cd ../client
pnpm install
```

### Step 5: Setup Frontend Environment
```bash
# .env already configured
# If needed, update VITE_API_URL in .env
```

### Step 6: Start Frontend
```bash
pnpm run dev
# Frontend runs on http://localhost:5173
```

### Step 7: Test the Application
1. Open http://localhost:5173 in browser
2. Click "Signup" → Create account
3. Login with your credentials
4. Add a company with "+ Add Company"
5. View and filter companies

## 📝 Sample Test Data

### Create User
```
Name: John Doe
Email: john@example.com
Password: password123
```

### Create Company
```
Name: TechCorp
Description: Leading technology company
City: Indore
State: Madhya Pradesh
Country: India
Website: https://techcorp.com
```

## 🔐 Security Features
- ✅ Login limited to 5 attempts per 15 minutes
- ✅ Passwords hashed with bcryptjs
- ✅ JWT authentication with 7-day expiration
- ✅ Role-based access control
- ✅ Image upload validation

## 📚 Documentation
- Backend API: [server/README.md](server/README.md)
- Full Setup: [SETUP.md](SETUP.md)

## 🌍 Deploy And Go Live

1. Deploy backend first (Railway/Render/Fly.io) and set:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your frontend domain)
2. Deploy frontend (Vercel/Netlify) and set:
   - `VITE_API_URL=https://<your-backend-domain>/api`
3. Update backend `CLIENT_URL` to your deployed frontend URL if it changed.

## 🆘 Common Issues

**MongoDB Connection Error?**
- Make sure MongoDB is running
- Check connection string in `.env`

**CORS Error?**
- Ensure backend is running on localhost:5000
- Check `VITE_API_URL` in client `.env`

**Port Already in Use?**
- Change PORT in server `.env`
- Or kill process using port 5000/5173

## 🎯 Next Steps
1. Explore the API endpoints
2. Add more features (reviews, ratings)
3. Deploy to production
4. Add email verification
5. Implement password reset

---

**Happy coding! 🎉**
