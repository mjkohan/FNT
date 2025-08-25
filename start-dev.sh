#!/bin/bash

echo "🚀 Starting FNT Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start all services
echo "📦 Starting PostgreSQL, Redis, and Server..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "🔍 Checking service status..."
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "🌐 Services:"
echo "   - Backend API: http://localhost:3000"
echo "   - Prisma Studio: http://localhost:5555"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   - Stop services: docker-compose -f docker-compose.dev.yml down"
echo "   - Restart: docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "🎯 Next steps:"
echo "   1. Start your frontend: cd client && npm run dev"
echo "   2. Test the API: curl http://localhost:3000/health"
echo "   3. Test Redis: docker exec -it redis_dev redis-cli ping"
