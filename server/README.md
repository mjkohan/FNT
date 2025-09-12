# FNT Server - Financial Trading Platform Backend

A robust, scalable Express.js backend server for the FNT (Financial Trading) platform. Built with TypeScript, Prisma ORM, PostgreSQL, and Redis for high-performance financial data processing and user management.

## 🚀 Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (12 salt rounds)
- Role-based access control (RBAC)
- Input validation with Zod schemas
- Security middleware (helmet, cors, rate limiting)
- CSRF protection and secure headers

### 📊 **Financial Data Management**
- Real-time cryptocurrency data integration
- Stock market data with Finnhub API
- Commodities trading information
- News aggregation and processing
- Bookmark management for users
- Caching with Redis for performance

### 🗄️ **Database & ORM**
- PostgreSQL database with Prisma ORM
- Type-safe database queries
- Database migrations and seeding
- Connection pooling and optimization
- Redis caching layer

### 🛡️ **API Features**
- RESTful API design
- Comprehensive error handling
- Request/response logging
- API documentation with OpenAPI
- Health check endpoints
- Rate limiting and throttling

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 6.x
- **Cache**: Redis 7.x
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: tsx for hot reload
- **Testing**: Jest + Supertest

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/fnt_db"
   
   # Redis
   REDIS_URL="redis://localhost:6379"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   
   # Server
   PORT=3000
   NODE_ENV="development"
   
   # External APIs
   FINNHUB_API_KEY="your-finnhub-api-key"
   NEWS_API_KEY="your-news-api-key"
   
   # CORS
   CORS_ORIGIN="http://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🐳 Docker Deployment

### Build the Docker image
```bash
docker build -t fnt-server .
```

### Run the container
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e REDIS_URL="redis://host:6379" \
  -e JWT_SECRET="your-secret" \
  fnt-server
```

### Using Docker Compose
```yaml
version: '3.8'
services:
  server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/fnt_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret
    depends_on:
      - postgres
      - redis
```

## 📁 Project Structure

```
server/
├── generated/           # Prisma generated client
├── middleware/          # Express middleware
│   └── auth.ts         # JWT authentication middleware
├── routes/             # API routes
│   ├── auth.ts         # Authentication routes
│   ├── users.ts        # User management routes
│   ├── bookmarks.ts    # Bookmark management
│   ├── news.ts         # News aggregation
│   └── stockNews.ts    # Stock-specific news
├── services/           # Business logic services
│   ├── newsService.ts  # News processing service
│   └── redisService.ts # Redis caching service
├── types/              # TypeScript type definitions
│   └── auth.ts         # Authentication types
├── utils/              # Utility functions
│   ├── auth.ts         # JWT and password utilities
│   └── validation.ts   # Zod validation schemas
├── prisma/             # Database schema and migrations
│   ├── schema.prisma   # Prisma schema
│   └── migrations/     # Database migrations
├── index.ts            # Main server file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── Dockerfile          # Production Docker configuration
└── Dockerfile.dev      # Development Docker configuration
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:deploy` - Deploy database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user account.

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
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Management (`/api/users`)

#### GET `/api/users/me`
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT `/api/users/profile`
Update user profile.

#### PUT `/api/users/password`
Change user password.

### Financial Data (`/api/stocks`, `/api/crypto`, `/api/commodities`)

#### GET `/api/stocks`
Get list of available stocks.

#### GET `/api/stocks/quote?symbol=AAPL`
Get stock quote data.

#### GET `/api/crypto`
Get cryptocurrency data.

#### GET `/api/commodities`
Get commodities data.

### News & Bookmarks (`/api/news`, `/api/bookmarks`)

#### GET `/api/news`
Get financial news.

#### GET `/api/bookmarks`
Get user bookmarks.

#### POST `/api/bookmarks`
Create new bookmark.

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Zod schemas for all inputs
- **Security Headers**: Helmet middleware
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: API rate limiting and throttling
- **Error Handling**: Centralized error handling
- **Request Logging**: Comprehensive request/response logging

## 📊 Database Schema

```sql
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Bookmark {
  id        Int      @id @default(autoincrement())
  userId    Int
  symbol    String
  type      String   // 'stock', 'crypto', 'commodity'
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

## 🌐 External API Integration

- **Finnhub API**: Stock and crypto market data
- **News API**: Financial news aggregation
- **TradingView**: Chart data and technical analysis
- **Redis**: Caching layer for performance

## 🚀 Performance Optimizations

- **Connection Pooling**: Database connection optimization
- **Redis Caching**: Response caching for frequently accessed data
- **Compression**: Gzip compression for responses
- **Rate Limiting**: API throttling and rate limiting
- **Error Handling**: Efficient error handling and logging

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### API Testing with curl

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

## 📈 Monitoring & Health Checks

- **Health Check**: `GET /health` - Server health status
- **Metrics**: Built-in performance metrics
- **Logging**: Structured logging with Winston
- **Error Tracking**: Comprehensive error logging

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT token expiration
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origins

### Database Configuration
- Connection pooling enabled
- SSL support for production
- Migration management with Prisma
- Automatic client generation

## 🚀 Production Deployment

1. **Set production environment variables**
2. **Configure database with SSL**
3. **Set up Redis cluster for caching**
4. **Configure reverse proxy (nginx)**
5. **Set up monitoring and logging**
6. **Use PM2 or similar process manager**
7. **Enable health checks and metrics**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the database schema

---

**Built with ❤️ using Express.js, TypeScript, Prisma, and PostgreSQL** 