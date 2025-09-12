# FNT - Financial Trading Platform

A comprehensive, modern financial trading platform built with Next.js, Express.js, TypeScript, and PostgreSQL. FNT provides real-time market data, interactive charts, news aggregation, and portfolio management for cryptocurrencies, stocks, and commodities.

## 🚀 Features

### 📊 **Real-time Market Data**
- Live cryptocurrency prices and charts
- Stock market data with real-time quotes
- Commodities trading information
- Interactive TradingView widgets integration
- Market heatmaps and ticker tapes

### 📈 **Advanced Analytics**
- Interactive price charts with multiple timeframes
- Technical analysis tools and indicators
- Financial overview and fundamentals
- AI-powered market analysis
- Fear & Greed Index

### 📰 **News & Insights**
- Real-time financial news aggregation
- Category-based news filtering
- AI-powered market analysis
- News sentiment analysis

### 🎨 **Modern UI/UX**
- Dark/Light theme support
- Responsive design for all devices
- Smooth animations with Framer Motion
- Accessible components with Radix UI
- Professional trading interface

### 🔐 **Authentication & Security**
- NextAuth.js integration
- Secure user sessions
- Protected routes and API endpoints
- JWT-based authentication
- Password hashing with bcrypt

### 💾 **Data Management**
- User bookmarks and watchlists
- Portfolio tracking
- Historical data storage
- Redis caching for performance
- PostgreSQL for data persistence

## 🛠️ Tech Stack

### **Frontend (Client)**
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Authentication**: NextAuth.js
- **Charts**: TradingView Widgets + Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

### **Backend (Server)**
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 6.x
- **Cache**: Redis 7.x
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, Rate Limiting

### **Infrastructure**
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL with connection pooling
- **Cache**: Redis for performance optimization
- **Reverse Proxy**: Nginx (optional)
- **Monitoring**: Health checks and logging

## 📦 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### 🐳 **Docker Deployment (Recommended)**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FNT
   ```

2. **Set up environment variables**
   ```bash
   # Copy the appropriate environment file
   cp env.prod .env.prod
   # Edit the file with your actual values
   nano .env.prod
   ```
   
   Configure the following variables in `.env.prod`:
   ```env
   # JWT Secret (change in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # NextAuth Secret (change in production)
   NEXTAUTH_SECRET=your-nextauth-secret-key
   
   # External API Keys
   FINNHUB_API_KEY=your-finnhub-api-key
   NEWS_API_KEY=your-news-api-key
   ```

3. **Start all services**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Or use the provided scripts
   ./start.sh  # Linux/Mac
   start.bat   # Windows
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3001
   - **Backend API**: http://localhost:3000
   - **Prisma Studio**: http://localhost:5555 (development only)

### 🛠️ **Local Development**

1. **Start infrastructure services**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose -f docker-compose.dev.yml up -d postgres redis
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Configure .env with your database URL
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   cp .env.example .env.local
   # Configure .env.local with your API URL
   npm run dev
   ```

## 📁 Project Structure

```
FNT/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   ├── Dockerfile         # Production Docker config
│   └── README.md          # Client documentation
├── server/                 # Express.js backend application
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   ├── prisma/            # Database schema
│   ├── Dockerfile         # Production Docker config
│   ├── Dockerfile.dev     # Development Docker config
│   └── README.md          # Server documentation
├── docker-compose.yml     # Production Docker Compose
├── docker-compose.dev.yml # Development Docker Compose
├── start.sh              # Linux/Mac start script
├── start.bat             # Windows start script
├── start-dev.sh          # Development start script
├── start-dev.bat         # Development start script (Windows)
└── README.md             # This file
```

## 🚀 Available Scripts

### **Development**
- `./start-dev.sh` - Start development environment (Linux/Mac)
- `start-dev.bat` - Start development environment (Windows)
- `docker-compose -f docker-compose.dev.yml up` - Start dev services

### **Production**
- `./start.sh` - Start production environment (Linux/Mac)
- `start.bat` - Start production environment (Windows)
- `docker-compose up -d` - Start production services

### **Individual Services**
- `docker-compose up postgres redis` - Start only database services
- `docker-compose up server` - Start only backend
- `docker-compose up client` - Start only frontend

## 🔧 Configuration

### **Environment Variables Strategy**

The project uses different environment files for different scenarios:

#### **📁 Environment Files Structure**
```
FNT/
├── env.prod          # Production environment (Docker Compose)
├── env.dev           # Development environment (Docker Compose)
├── client/.env.local # Client local development
└── server/.env       # Server local development
```

#### **🐳 Docker Environment Files**

**Production (`env.prod`):**
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
FINNHUB_API_KEY=your-finnhub-api-key
NEWS_API_KEY=your-news-api-key
NODE_ENV=production
```

**Development (`env.dev`):**
```env
JWT_SECRET=dev-jwt-secret-key
NEXTAUTH_SECRET=dev-nextauth-secret-key
FINNHUB_API_KEY=your-finnhub-api-key
NEWS_API_KEY=your-news-api-key
NODE_ENV=development
```

#### **💻 Local Development Files**

**Client (`client/.env.local`):**
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Server (`server/.env`):**
```env
DATABASE_URL=postgresql://fnt_user:fnt_password@localhost:5432/fnt_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
FINNHUB_API_KEY=your-finnhub-key
NEWS_API_KEY=your-news-api-key
```

### **Docker Compose Profiles**

- **Default**: All services (postgres, redis, server, client)
- **Development**: Includes Prisma Studio
- **Production**: Includes Nginx reverse proxy

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Get current user

### **Financial Data**
- `GET /api/stocks` - Get stocks list
- `GET /api/stocks/quote?symbol=AAPL` - Get stock quote
- `GET /api/crypto` - Get cryptocurrency data
- `GET /api/commodities` - Get commodities data

### **News & Bookmarks**
- `GET /api/news` - Get financial news
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks` - Create bookmark

## 🔒 Security Features

- **Authentication**: JWT-based with NextAuth.js
- **Password Security**: bcrypt hashing
- **Input Validation**: Zod schemas
- **Security Headers**: Helmet middleware
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: API throttling
- **HTTPS**: SSL/TLS support (production)

## 📊 Database Schema

```sql
-- Users table
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  bookmarks Bookmark[]
}

-- Bookmarks table
model Bookmark {
  id        Int      @id @default(autoincrement())
  userId    Int
  symbol    String
  type      String   // 'stock', 'crypto', 'commodity'
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

## 🚀 Performance Optimizations

- **Frontend**: Next.js Image optimization, code splitting, Turbopack
- **Backend**: Connection pooling, Redis caching, compression
- **Database**: Indexed queries, connection pooling
- **Caching**: Redis for frequently accessed data
- **CDN**: Static asset optimization

## 🧪 Testing

### **API Testing**
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### **Frontend Testing**
```bash
cd client
npm run test
```

## 📈 Monitoring & Health Checks

- **Health Endpoints**: `/health` for both client and server
- **Docker Health Checks**: Built-in container health monitoring
- **Logging**: Structured logging with Winston
- **Metrics**: Performance monitoring and error tracking

## 🚀 Production Deployment

### **Docker Production**
1. Set production environment variables
2. Configure SSL certificates
3. Set up reverse proxy (Nginx)
4. Configure monitoring and logging
5. Use `docker-compose up -d`

### **Cloud Deployment**
- **AWS**: ECS, RDS, ElastiCache
- **Google Cloud**: Cloud Run, Cloud SQL, Memorystore
- **Azure**: Container Instances, Database, Cache
- **DigitalOcean**: App Platform, Managed Databases

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
- Check the individual README files in `client/` and `server/`
- Review the API documentation

## 🙏 Acknowledgments

- **TradingView** for chart widgets
- **Finnhub** for market data API
- **Next.js** and **Express.js** communities
- **Prisma** for database ORM
- **Tailwind CSS** for styling

---

**Built with ❤️ using Next.js, Express.js, TypeScript, and PostgreSQL**

**FNT - Your Gateway to Financial Markets** 🚀📈
The FNT(financial news tracker) project is a comprehensive software platform for managing and analyzing financial news, designed with a focus on practical software capabilities. The use of artificial intelligence for sentiment analysis of news is an additional feature of this platform that helps users benefit from more accurate analyses.
