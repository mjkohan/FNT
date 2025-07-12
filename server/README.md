# JWT Authentication Server

A secure Express.js server with JWT authentication, built with TypeScript, Prisma ORM, and PostgreSQL.

## Features

- 🔐 JWT-based authentication
- 🔒 Password hashing with bcrypt
- 📝 Input validation with Zod
- 🛡️ Security middleware (helmet, cors)
- 🗄️ Type-safe database queries with Prisma
- 📊 PostgreSQL database
- 🐳 Docker support

## Database Schema

```sql
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Routes (`/api/users`)

All routes require authentication via Bearer token in Authorization header.

#### GET `/api/users/me`
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/users`
Get all users (password excluded).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the server directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fnt_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Project Structure

```
server/
├── generated/           # Prisma generated client
├── middleware/          # Express middleware
│   └── auth.ts         # JWT authentication middleware
├── routes/             # API routes
│   ├── auth.ts         # Authentication routes
│   └── users.ts        # User routes (protected)
├── types/              # TypeScript type definitions
│   └── auth.ts         # Authentication types
├── utils/              # Utility functions
│   ├── auth.ts         # JWT and password utilities
│   └── validation.ts   # Zod validation schemas
├── prisma/             # Database schema and migrations
│   └── schema.prisma   # Prisma schema
├── index.ts            # Main server file
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: All inputs validated with Zod schemas
- **Security Headers**: Helmet middleware for security headers
- **CORS**: Configured CORS for cross-origin requests
- **Error Handling**: Centralized error handling middleware

## Testing the API

### Using curl

1. **Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

3. **Access protected route:**
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman/Insomnia

1. Set the base URL to `http://localhost:3000`
2. For protected routes, add the Authorization header:
   - Type: Bearer Token
   - Token: Your JWT token from login/register

## Docker Support

The project includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper database connection
4. Set up reverse proxy (nginx)
5. Use PM2 or similar process manager

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials, missing token)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `500` - Internal Server Error 