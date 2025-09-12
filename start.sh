#!/bin/bash

echo "🚀 Starting FNT Production Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi



# Start all services
echo "📦 Starting PostgreSQL, Redis, Server, and Client..."
docker compose -f docker-compose.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 15


echo ""
echo "✅ Production environment is ready!"
echo ""
echo "🌐 Services:"
echo "   - Frontend: http://localhost:3001"
echo "   - Backend API: http://localhost:3000"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart: docker-compose restart"
echo "   - View specific service logs: docker-compose logs -f [service_name]"
echo ""
echo "🎯 Next steps:"
echo "   1. Open http://localhost:3001 in your browser"
echo "   2. Test the API: curl http://localhost:3000/health"
echo "   3. Check service health: docker-compose ps"
echo ""
echo "🔧 Management commands:"
echo "   - Scale services: docker-compose up -d --scale [service]=[count]"
echo "   - Update services: docker-compose pull && docker-compose up -d"
echo "   - View resource usage: docker stats"
echo ""
