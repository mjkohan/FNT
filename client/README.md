# FNT Client - Financial Trading Platform

A modern, responsive Next.js client application for the FNT (Financial Trading) platform. This application provides real-time financial data, interactive charts, news, and comprehensive analytics for cryptocurrencies, stocks, and commodities.

## 🚀 Features

### 📊 **Real-time Market Data**
- Live cryptocurrency prices and charts
- Stock market data with real-time quotes
- Commodities trading information
- Interactive TradingView widgets integration

### 📈 **Advanced Analytics**
- Interactive price charts with multiple timeframes
- Technical analysis tools
- Market heatmaps and ticker tapes
- Financial overview and fundamentals

### 📰 **News & Insights**
- Real-time financial news
- AI-powered market analysis
- Fear & Greed Index
- Category-based news filtering

### 🎨 **Modern UI/UX**
- Dark/Light theme support
- Responsive design for all devices
- Smooth animations with Framer Motion
- Accessible components with Radix UI

### 🔐 **Authentication & Security**
- NextAuth.js integration
- Secure user sessions
- Protected routes and API endpoints

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Authentication**: NextAuth.js
- **Charts**: TradingView Widgets + Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Docker (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL_SERVER=http://localhost:3001
   
   # API endpoints
   NEXT_PUBLIC_API_URL=http://localhost:3000
   
   # External API keys (if needed)
   FINNHUB_API_KEY=your-finnhub-key
   NEWS_API_KEY=your-news-api-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🐳 Docker Deployment

### Build the Docker image
```bash
docker build -t fnt-client .
```

### Run the container
```bash
docker run -p 3001:3001 \
  -e NEXTAUTH_URL=http://localhost:3001 \
  -e NEXTAUTH_SECRET=your-secret-key \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000 \
  fnt-client
```

### Using Docker Compose
```yaml
version: '3.8'
services:
  client:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NEXTAUTH_URL=http://localhost:3001
      - NEXTAUTH_SECRET=your-secret-key
      - NEXT_PUBLIC_API_URL=http://localhost:3000
    depends_on:
      - server
```

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard pages
│   │   │   ├── (symbols)/     # Symbol-specific pages
│   │   │   │   ├── crypto/    # Crypto pages
│   │   │   │   ├── stocks/    # Stock pages
│   │   │   │   └── commodities/ # Commodity pages
│   │   │   └── page.tsx       # Dashboard home
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── TradingViewChart.tsx
│   │   ├── TradingViewTickerTape.tsx
│   │   ├── TradingViewCryptoHeatmap.tsx
│   │   └── TradingViewFinancials.tsx
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── services/             # API services
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── Dockerfile               # Docker configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🔧 Configuration

### Next.js Configuration
The application uses Next.js 15 with the following key configurations:
- **Standalone output** for optimized Docker builds
- **Turbopack** for faster development builds
- **Image optimization** with remote patterns for external APIs
- **App Router** for modern routing

### Tailwind CSS
- **Tailwind CSS 4.x** with custom configuration
- **CSS Variables** for theme management
- **Custom utilities** for line-clamp and scrollbars
- **Dark mode** support with system preference detection

## 🌐 API Integration

The client integrates with several external APIs:
- **Finnhub API** - Stock and crypto data
- **News API** - Financial news
- **TradingView** - Charts and technical analysis
- **Custom Backend API** - User data and bookmarks

## 🔒 Security Features

- **NextAuth.js** for secure authentication
- **CSRF protection** on API routes
- **Input validation** with Zod schemas
- **Secure headers** and CORS configuration
- **Non-root Docker user** for container security

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🎨 Theming

- **Light/Dark mode** with system preference detection
- **Custom CSS variables** for consistent theming
- **TradingView widget** theme integration
- **Accessible color contrast** ratios

## 🚀 Performance Optimizations

- **Next.js Image optimization** for faster loading
- **Code splitting** with dynamic imports
- **Standalone output** for smaller Docker images
- **Turbopack** for faster development builds
- **React Query** for efficient data fetching and caching

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
- Check the documentation
- Review the API documentation

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
