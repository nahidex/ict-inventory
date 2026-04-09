@echo off
REM Asset Lifecycle Management - Docker Helper Script for Windows

setlocal enabledelayedexpansion

set "GREEN=[92m"
set "BLUE=[94m"
set "RED=[91m"
set "YELLOW=[93m"
set "NC=[0m"

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo %RED%Error: Docker is not installed%NC%
    exit /b 1
)

REM Main command handler
if "%1"=="" goto :help
if "%1"=="setup" goto :setup
if "%1"=="build" goto :build
if "%1"=="start" goto :start
if "%1"=="stop" goto :stop
if "%1"=="restart" goto :restart
if "%1"=="logs" goto :logs
if "%1"=="status" goto :status
if "%1"=="migrate" goto :migrate
if "%1"=="seed" goto :seed
if "%1"=="clean" goto :clean
if "%1"=="help" goto :help
goto :help

:setup
echo %BLUE%Setting up environment...%NC%
if not exist .env (
    if exist .env.docker (
        copy .env.docker .env
        echo %GREEN%Created .env file%NC%
        echo %YELLOW%Please edit .env and update passwords!%NC%
    ) else (
        echo %RED%Error: .env.docker not found%NC%
        exit /b 1
    )
)
echo %BLUE%Building containers...%NC%
docker-compose build
echo %BLUE%Starting containers...%NC%
docker-compose up -d
timeout /t 5 /nobreak >nul
echo %BLUE%Running migrations...%NC%
docker-compose exec backend npx prisma migrate deploy
echo %GREEN%Setup completed!%NC%
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
goto :eof

:build
echo %BLUE%Building containers...%NC%
docker-compose build
echo %GREEN%Build completed%NC%
goto :eof

:start
echo %BLUE%Starting containers...%NC%
docker-compose up -d
echo %GREEN%Containers started%NC%
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
goto :eof

:stop
echo %BLUE%Stopping containers...%NC%
docker-compose down
echo %GREEN%Containers stopped%NC%
goto :eof

:restart
echo %BLUE%Restarting containers...%NC%
docker-compose restart
echo %GREEN%Containers restarted%NC%
goto :eof

:logs
if "%2"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %2
)
goto :eof

:status
echo %BLUE%Container status:%NC%
docker-compose ps
goto :eof

:migrate
echo %BLUE%Running migrations...%NC%
docker-compose exec backend npx prisma migrate deploy
echo %GREEN%Migrations completed%NC%
goto :eof

:seed
echo %BLUE%Seeding database...%NC%
docker-compose exec backend npx prisma db seed
echo %GREEN%Database seeded%NC%
goto :eof

:clean
echo %YELLOW%This will remove all containers and data. Continue? (Y/N)%NC%
set /p confirm=
if /i "%confirm%"=="Y" (
    echo %BLUE%Cleaning up...%NC%
    docker-compose down -v
    echo %GREEN%Clean up completed%NC%
) else (
    echo Cancelled
)
goto :eof

:help
echo Asset Lifecycle Management - Docker Helper Script
echo.
echo Usage: docker.bat [command]
echo.
echo Commands:
echo   setup       - Complete setup (env, build, start, migrate)
echo   build       - Build Docker containers
echo   start       - Start containers
echo   stop        - Stop containers
echo   restart     - Restart containers
echo   logs [svc]  - View logs (optional: specify service)
echo   status      - Show container status
echo   migrate     - Run database migrations
echo   seed        - Seed database
echo   clean       - Remove all containers and volumes
echo   help        - Show this help message
echo.
echo Examples:
echo   docker.bat setup          # Full setup
echo   docker.bat logs backend   # View backend logs
echo   docker.bat migrate        # Run migrations
goto :eof
