# Zoronal Backend API

A robust Express.js backend for the Zoronal company review platform, featuring user authentication, role-based access control, rate limiting, and image uploads.

## Features

- **User Authentication**: Signup and login with JWT tokens
- **Role-Based Access Control**: Admin and user roles
- **Rate Limiting**: Login attempts limited to prevent brute force attacks
- **Image Uploads**: Support for avatar and company logo uploads
- **Company Management**: CRUD operations for companies
- **Search & Filter**: Search companies by name and city
- **MongoDB Integration**: Persistent data storage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Rate Limiting**: express-rate-limit
- **Validation**: express-validator

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- pnpm

### Setup

1. **Install dependencies**

```bash
cd server
npm install
# or
pnpm install
```

2. **Create `.env` file**

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

3. **Configure environment variables**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zoronal
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_PATH=./uploads
```

4. **Start MongoDB**

Make sure MongoDB is running on your system or update `MONGODB_URI` to your cloud MongoDB instance.

5. **Start the server**

```bash
# Development (with auto-reload)
pnpm run dev

# Production
pnpm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Signup
- **POST** `/api/auth/signup`
- **Body**: `{ fullName, email, password }`
- **Response**: JWT token and user data

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: JWT token and user data
- **Rate Limit**: 5 attempts per 15 minutes

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user data

#### Update Profile
- **PUT** `/api/auth/updateprofile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ fullName, email }`
- **Response**: Updated user data

#### Upload Avatar
- **POST** `/api/auth/upload-avatar`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData with `avatar` file
- **Response**: Updated user data with avatar URL

### Companies

#### Get All Companies
- **GET** `/api/companies`
- **Query Parameters**:
  - `search`: Search by company name
  - `city`: Filter by city
  - `sortBy`: Sort by (name, rating, reviews, newest)
- **Response**: Array of companies

#### Get Single Company
- **GET** `/api/companies/:id`
- **Response**: Company details

#### Create Company
- **POST** `/api/companies`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData with:
  - `name`: Company name (required)
  - `description`: Company description (required)
  - `city`: City (required)
  - `state`: State (optional)
  - `country`: Country (optional)
  - `website`: Website URL (optional)
  - `email`: Email (optional)
  - `phone`: Phone number (optional)
  - `industry`: Industry type (optional)
  - `logoText`: Logo text display (optional)
  - `logo`: Logo image file (optional)
- **Response**: Created company data

#### Update Company
- **PUT** `/api/companies/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Same as create company (FormData)
- **Response**: Updated company data
- **Authorization**: Only company creator or admin

#### Delete Company
- **DELETE** `/api/companies/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Authorization**: Only company creator or admin
- **Response**: Success message

#### Get User's Companies
- **GET** `/api/companies/user/mycompanies`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of companies created by user

## Security Features

### Login Attempts Limiting
- Maximum 5 failed login attempts per 15 minutes
- Account locks for 30 minutes after 5 failed attempts
- Automatically resets on successful login

### Password Security
- Passwords hashed using bcryptjs with salt rounds of 10
- Passwords never returned in API responses

### Authentication
- JWT-based authentication
- Token expiration set to 7 days by default
- Protected routes require valid token

### Authorization
- Role-based access control (user, admin)
- Company operations restricted to creator or admin

### File Upload
- Image file size limit: 5MB
- Allowed formats: JPEG, PNG, GIF, WebP
- Files stored with unique UUID names

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## File Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── companyController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.js
│   │   ├── rateLimiter.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── companyRoutes.js
│   ├── utils/
│   │   └── tokenUtils.js
│   └── server.js
├── uploads/
├── .env
├── .env.example
└── package.json
```

## Usage Example

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Company
```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=TechCorp" \
  -F "description=A tech company" \
  -F "city=Indore" \
  -F "logo=@path/to/logo.png"
```

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Company reviews and ratings
- [ ] User profile pages
- [ ] Advanced search filters
- [ ] Social media integration
- [ ] Admin dashboard

## License

ISC
