# API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 AUTH ENDPOINTS

### 1. Signup
**POST** `/auth/signup`

**Public** - No authentication required

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "role": "user"
  }
}
```

**Rate Limit:** 3 per hour per IP

---

### 2. Login
**POST** `/auth/login`

**Public** - No authentication required

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "role": "user"
  }
}
```

**Rate Limit:** 5 attempts per 15 minutes per IP
**Account Lock:** After 5 failed attempts, locked for 30 minutes

---

### 3. Get Current User
**GET** `/auth/me`

**Protected** - Requires Bearer token

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": "/uploads/avatar-uuid.jpg",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Update Profile
**PUT** `/auth/updateprofile`

**Protected** - Requires Bearer token

**Request:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "avatar": "/uploads/avatar-uuid.jpg",
    "role": "user"
  }
}
```

---

### 5. Upload Avatar
**POST** `/auth/upload-avatar`

**Protected** - Requires Bearer token

**Request:** FormData
```
- avatar: File (image file, max 5MB)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": "/uploads/avatar-507f1f77bcf86cd799439011.jpg",
    "role": "user"
  }
}
```

**Allowed Formats:** JPEG, PNG, GIF, WebP
**Max Size:** 5MB

---

### 6. Logout
**POST** `/auth/logout`

**Protected** - Requires Bearer token

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🏢 COMPANY ENDPOINTS

### 1. Get All Companies
**GET** `/companies`

**Public** - No authentication required

**Query Parameters:**
```
- search (optional): Search by company name
- city (optional): Filter by city
- sortBy (optional): name | rating | reviews | newest
```

**Example:**
```
GET /companies?search=Tech&city=Indore&sortBy=rating
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "TechCorp",
      "description": "Leading tech company",
      "logo": "/uploads/logo-uuid.jpg",
      "logoText": "TC",
      "city": "Indore",
      "state": "Madhya Pradesh",
      "country": "India",
      "website": "https://techcorp.com",
      "email": "info@techcorp.com",
      "phone": "+91-8888888888",
      "industry": "Technology",
      "rating": 4.5,
      "reviewsCount": 10,
      "isVerified": false,
      "createdBy": {
        "_id": "507f1f77bcf86cd799439011",
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Company
**GET** `/companies/:id`

**Public** - No authentication required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "TechCorp",
    "description": "Leading tech company",
    "logo": "/uploads/logo-uuid.jpg",
    "logoText": "TC",
    "city": "Indore",
    "state": "Madhya Pradesh",
    "country": "India",
    "website": "https://techcorp.com",
    "email": "info@techcorp.com",
    "phone": "+91-8888888888",
    "industry": "Technology",
    "rating": 4.5,
    "reviewsCount": 10,
    "isVerified": false,
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 3. Create Company
**POST** `/companies`

**Protected** - Requires Bearer token

**Request:** FormData
```
- name: String (required)
- description: String (required)
- city: String (required)
- state: String (optional)
- country: String (optional)
- website: String (optional)
- email: String (optional)
- phone: String (optional)
- industry: String (optional)
- logoText: String (optional)
- logo: File (optional, image file)
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "TechCorp",
    "description": "Leading tech company",
    "logo": "/uploads/logo-uuid.jpg",
    "logoText": "TC",
    "city": "Indore",
    "state": "Madhya Pradesh",
    "country": "India",
    "website": "https://techcorp.com",
    "email": "info@techcorp.com",
    "phone": "+91-8888888888",
    "industry": "Technology",
    "rating": 0,
    "reviewsCount": 0,
    "isVerified": false,
    "createdBy": "507f1f77bcf86cd799439011"
  }
}
```

---

### 4. Update Company
**PUT** `/companies/:id`

**Protected** - Requires Bearer token

**Authorization:** Company creator or admin only

**Request:** FormData (same as create)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "TechCorp Updated",
    "description": "Updated description",
    "...": "..."
  }
}
```

---

### 5. Delete Company
**DELETE** `/companies/:id`

**Protected** - Requires Bearer token

**Authorization:** Company creator or admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

---

### 6. Get User's Companies
**GET** `/companies/user/mycompanies`

**Protected** - Requires Bearer token

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "TechCorp",
      "description": "Leading tech company",
      "...": "..."
    }
  ]
}
```

---

## 🔍 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error description"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this company"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Company not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## 🔒 Security & Rate Limits

| Endpoint | Rate Limit |
|----------|-----------|
| `/auth/signup` | 3 per hour |
| `/auth/login` | 5 per 15 minutes |
| Other API | 100 per 15 minutes |

---

## 💾 Database Validation

### User Creation
- Email must be unique
- Email must be valid format
- Password minimum 6 characters
- Full name required

### Company Creation
- Name must be unique
- Name, description, city required
- Logo file: images only, max 5MB

---

## 📱 Frontend Usage

```javascript
import api from '@/services/api'

// Signup
await api.signup('John Doe', 'john@example.com', 'password123')

// Login
await api.login('john@example.com', 'password123')

// Get all companies
const companies = await api.getAllCompanies('search', 'city', 'sortBy')

// Create company
await api.createCompany({
  name: 'Company',
  description: 'Desc',
  city: 'City'
}, logoFile)

// Update profile
await api.updateProfile('New Name', 'newemail@example.com')
```

---

For complete backend documentation, see [server/README.md](server/README.md)
