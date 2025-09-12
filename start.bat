@echo off
echo 🚀 Starting FNT Production Environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)



REM Start all services
echo 📦 Starting PostgreSQL, Redis, Server, and Client...
docker compose -f docker-compose.yml up --build -d

REM Wait for services to be healthy
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul



echo.
echo ✅ Production environment is ready!
echo.
echo 🌐 Services:
echo    - Frontend: http://localhost:3001
echo    - Backend API: http://localhost:3000
echo    - PostgreSQL: localhost:5432
echo    - Redis: localhost:6379
echo.
echo 📝 Useful commands:
echo    - View logs: docker-compose logs -f
echo    - Stop services: docker-compose down
echo    - Restart: docker-compose restart
echo    - View specific service logs: docker-compose logs -f [service_name]
echo.
echo 🎯 Next steps:
echo    1. Open http://localhost:3001 in your browser
echo    2. Test the API: curl http://localhost:3000/health
echo    3. Check service health: docker-compose ps
echo.
echo 🔧 Management commands:
echo    - Scale services: docker-compose up -d --scale [service]=[count]
echo    - Update services: docker-compose pull ^&^& docker-compose up -d
echo    - View resource usage: docker stats
echo.
pause
