# ⚡ Quizify

Quizify is a modern, fast, and interactive web application that allows users to create, share, and take quizzes seamlessly. Built with the MERN stack (MongoDB, Express, React, Node.js) and styled beautifully with Tailwind CSS.

## 🚀 Features

- **Authentication System**: Secure JWT-based registration and login with HTTP-only cookies.
- **Create Quizzes**: Intuitive quiz builder with custom categories, difficulty levels, and multiple-choice options.
- **Discover Quizzes**: Browse a rich library of quizzes with real-time search, filters, and pagination.
- **Interactive Quiz Taking**: Timer-based quiz attempts, instant feedback, and dynamic progress tracking.
- **Dashboard & Analytics**: Track your created quizzes, view attempt history, and monitor your average scores.
- **Leaderboards**: Compete with others and see the top 10 scorers for every quiz.
- **Responsive & Modern Design**: Sleek glass-morphism UI, micro-animations, and a responsive layout using Tailwind CSS.
- **Production Ready**: Rate limiting, security headers (Helmet), optimized builds, and custom error handling.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- React Icons

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Helmet & Express Rate Limit

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or Local MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Quizify
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
   Start the server:
   ```bash
   npm run dev
   ```

3. **Setup Client**
   Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   npm install
   ```
   Start the client:
   ```bash
   npm run dev
   ```

4. **Visit the App**
   Open your browser and navigate to `http://localhost:5173`.

## 📜 License
This project is licensed under the MIT License.
