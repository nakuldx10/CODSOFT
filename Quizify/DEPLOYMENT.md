# 🚀 Quizify Deployment Guide

This guide walks you through deploying the Quizify full-stack MERN application. We recommend **Render** for the Express Backend and **Vercel** or **Netlify** for the React Frontend.

---

## 1. Prepare MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Set up a database user and password.
3. Whitelist IP addresses (allow access from anywhere `0.0.0.0/0` for deployment).
4. Get your connection string (URI).

---

## 2. Deploying the Backend (Render)

1. Create an account on [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Fill in the deployment details:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click on **Advanced** and add Environment Variables:
   - `PORT`: `10000`
   - `MONGO_URI`: *Your MongoDB connection string*
   - `JWT_SECRET`: *A secure random string*
   - `JWT_EXPIRE`: `7d`
   - `CLIENT_URL`: *Your frontend URL (e.g., https://quizify-app.vercel.app). Temporarily use `*` if you haven't deployed the frontend yet.*
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Render will build and deploy the backend. Copy the deployed backend URL (e.g., `https://quizify-api.onrender.com`).

---

## 3. Deploying the Frontend (Vercel)

1. Navigate to the `client` directory in your project.
2. Create or update `.env.production`:
   ```env
   VITE_API_URL=https://quizify-api.onrender.com
   ```
3. Commit and push your changes to GitHub.
4. Create an account on [Vercel.com](https://vercel.com).
5. Click **Add New Project** and import your repository.
6. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
7. Add Environment Variables in Vercel:
   - `VITE_API_URL`: `https://quizify-api.onrender.com`
8. Click **Deploy**.

---

## 4. Final Wiring

1. Go back to Render (Backend settings).
2. Update the `CLIENT_URL` environment variable to match your new Vercel URL exactly (e.g., `https://your-app.vercel.app` - no trailing slash).
3. **Important for Cookies:** Since the frontend and backend are on different domains, the backend uses `sameSite: 'none'` and `secure: true` for the JWT cookie. This is automatically handled by the `NODE_ENV=production` check we added to `authController.js`.
4. Redeploy the backend if you changed the environment variables.

---

🎉 **Congratulations! Quizify is now live!**
