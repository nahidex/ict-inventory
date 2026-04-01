# Asset Lifecycle API Server

A high-performance API server built with Node.js, Express, and TypeScript.

## Project Structure

The project follows a modular and scalable structure:

- `src/config/`: Configuration files and environment variables handling.
- `src/controllers/`: Route handlers and business logic entry points.
- `src/models/`: Data models and database schemas.
- `src/routes/`: API route definitions.
- `src/services/`: Reusable business logic and external integrations.
- `src/middleware/`: Express middleware (auth, logging, etc.).
- `src/utils/`: Helper functions and utilities.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root directory (refer to `.env` provided).

3.  **Run in development mode:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

5.  **Start production server:**
    ```bash
    npm start
    ```

## API Endpoints

- **GET /**: Base route.
- **GET /api/health**: Health check endpoint.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Nodemon](https://nodemon.io/)
- [Helmet](https://helmetjs.github.io/)
- [Cors](https://github.com/expressjs/cors)
- [Morgan](https://github.com/expressjs/morgan)
- [Dotenv](https://github.com/motdotla/dotenv)
# ict-inventory
