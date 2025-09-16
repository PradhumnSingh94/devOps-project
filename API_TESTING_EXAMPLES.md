# API Testing Examples

This document provides examples of how to test the authentication API endpoints.

## Authentication Endpoints

### 1. Sign Up (POST /api/auth/sign-up)

```bash
curl -X POST http://localhost:8000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Sign In (POST /api/auth/sign-in)

```bash
curl -X POST http://localhost:8000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Sign in successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 3. Get Profile (GET /api/auth/profile) - Protected Route

```bash
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Content-Type: application/json" \
  -b "token=YOUR_JWT_TOKEN"
```

**Expected Response (200):**
```json
{
  "message": "Profile data",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Admin Route (GET /api/auth/admin) - Admin Only

```bash
curl -X GET http://localhost:8000/api/auth/admin \
  -H "Content-Type: application/json" \
  -b "token=YOUR_JWT_TOKEN"
```

**Expected Response (200) for admin users:**
```json
{
  "message": "Admin only content",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Expected Response (403) for non-admin users:**
```json
{
  "error": "Insufficient permissions"
}
```

### 5. Sign Out (POST /api/auth/sign-out)

```bash
curl -X POST http://localhost:8000/api/auth/sign-out \
  -H "Content-Type: application/json" \
  -b "token=YOUR_JWT_TOKEN"
```

**Expected Response (200):**
```json
{
  "message": "Sign out successful"
}
```

## Error Responses

### Validation Errors (400)
```json
{
  "error": "User data validation failed",
  "details": "Email must be a valid email address"
}
```

### Authentication Errors (401)
```json
{
  "error": "Invalid email or password"
}
```

### Authorization Errors (403)
```json
{
  "error": "Insufficient permissions"
}
```

### Duplicate Email (409)
```json
{
  "error": "Email already exists"
}
```

## Testing with Postman/Insomnia

1. **Import Environment Variables:**
   - `BASE_URL`: http://localhost:8000
   
2. **Authentication Flow:**
   1. POST `{{BASE_URL}}/api/auth/sign-up` with user data
   2. POST `{{BASE_URL}}/api/auth/sign-in` with credentials
   3. The JWT token will be set as an HTTP-only cookie automatically
   4. Test protected routes like `{{BASE_URL}}/api/auth/profile`

## Database Setup

Make sure you have run the migrations before testing:

```bash
npm run db:generate  # Generate migration files from schema
npm run db:migrate   # Apply migrations to database
```

You can also use Drizzle Studio to inspect your database:

```bash
npm run db:studio
```

## Development Server

Start the development server with hot reload:

```bash
npm run dev
```

The server will be available at http://localhost:8000