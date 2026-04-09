# Asset Lifecycle Management System

A comprehensive asset lifecycle management system with a modern React frontend and Node.js backend API, featuring role-based access control, asset tracking, maintenance management, and more.

## 🚀 Quick Start with Docker

The fastest way to run the entire application:

```bash
# 1. Copy environment file
cp .env.docker .env

# 2. Update passwords and secrets in .env file
# IMPORTANT: Change DB_PASSWORD and JWT_SECRET!

# 3. Start all services
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

For detailed Docker instructions, see [DOCKER.md](DOCKER.md)

## Project Structure

The project follows a modular and scalable structure:

- `src/config/`: Configuration files and environment variables handling.
- `src/controllers/`: Route handlers and business logic entry points.
- `src/models/`: Data models and database schemas.
- `src/routes/`: API route definitions.
- `src/services/`: Reusable business logic and external integrations.
- `src/middleware/`: Express middleware (auth, logging, etc.).
- `src/utils/`: Helper functions and utilities.

## 🛠️ Manual Setup (Without Docker)

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MySQL 8.0 or later

### Backend Setup

1.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    # Edit .env and configure database credentials
    ```

4.  **Run database migrations:**
    ```bash
    npx prisma migrate deploy
    ```

5.  **Seed the database (optional):**
    ```bash
    npx prisma db seed
    ```

6.  **Run in development mode:**
    ```bash
    npm run dev
    ```

7.  **Build for production:**
    ```bash
    npm run build
    npm start
    ```

### Frontend Setup

1.  **Navigate to frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    # Update API URL if needed
    ```

4.  **Run in development mode:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    npm run preview
    ```

## API Endpoints

- **GET /**: Base route.
- **GET /api/health**: Health check endpoint.

## 🔧 Technologies Used

### Backend
- [Node.js](https://nodejs.org/) - Runtime environment
- [Express](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Prisma](https://www.prisma.io/) - ORM for database
- [MySQL](https://www.mysql.com/) - Database
- [JWT](https://jwt.io/) - Authentication
- [Helmet](https://helmetjs.github.io/) - Security middleware
- [Multer](https://github.com/expressjs/multer) - File upload handling

### Frontend
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [React Router](https://reactrouter.com/) - Routing
- [Axios](https://axios-http.com/) - HTTP client
- [Lucide React](https://lucide.dev/) - Icons

### DevOps
- [Docker](https://www.docker.com/) - Containerization
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container orchestration
- [Nginx](https://www.nginx.com/) - Frontend web server

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
