# HireHub 🚀
> Your hub for finding and posting dream jobs.

![Phase](https://img.shields.io/badge/Phase-4%20(Completed)-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌐 Live Demo
- Frontend: https://hirehub.vercel.app
- Backend API: https://hirehub-backend.onrender.com

## ✨ Features
### For Candidates:
- Browse and search thousands of job listings
- Advanced filters (location, salary, type, experience, remote)
- One-click job applications with resume upload
- Real-time application status tracking
- Save jobs for later
- Complete professional profile with skills and experience
- Email notifications for status updates and new applications

### For Employers:
- Post detailed job listings in minutes
- Manage all job postings (edit, close, delete)
- Review and manage all applications
- Update application status with automated candidate notifications
- Company profile management

### Platform:
- JWT authentication with refresh token rotation
- Email notifications for all key events
- Dark/Light mode default
- Fully responsive (mobile, tablet, desktop)
- Secure: helmet, rate limiting, input sanitization

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, Framer Motion, React-Hook-Form |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (access + refresh tokens), bcryptjs |
| Email | Nodemailer (Gmail SMTP / Ethereal) |
| File Upload | Multer |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

## 📁 Project Structure
```
hirehub/
├── backend/
│   ├── config/        # DB config
│   ├── controllers/   # Route logic (auth, jobs, apps, notifications)
│   ├── middleware/    # Auth, upload, and error middleware
│   ├── models/        # Mongoose schemas (User, Job, Application)
│   ├── routes/        # Express routers
│   ├── uploads/       # Local file storage (resumes/logos)
│   ├── utils/         # JWT generation, email service
│   ├── package.json
│   ├── server.js      # App entry point with security hardening
│   ├── render.yaml    # Render deployment config
│   └── seed.js        # DB seed script
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/       # Axios instance with interceptors
    │   ├── components/# Reusable UI & Skeletons
    │   ├── context/   # Global AuthContext
    │   ├── hooks/     # Custom hooks (useAuth, usePageTitle)
    │   ├── pages/     # Page views (Auth, Candidate, Employer, NotFound)
    │   ├── styles/    # Tailwind global CSS
    │   ├── App.jsx    # Routes & ErrorBoundary
    │   └── main.jsx   # React entry point
    ├── package.json
    ├── vercel.json    # Vercel rewrites & security headers
    ├── tailwind.config.js
    └── vite.config.js # Vite config & chunking rules
```

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password enabled

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (MONGO_URI, EMAIL_USER, EMAIL_PASS)
node seed.js
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

## 🔑 Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Candidate | rahul@test.com | Test@123 |
| Candidate | priya@test.com | Test@123 |
| Employer | techcorp@test.com | Test@123 |
| Employer | designhub@test.com | Test@123 |

## 📡 API Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/refresh` | Refresh access token | Cookie |
| POST | `/api/auth/logout` | Logout user | Cookie |
| GET | `/api/auth/me` | Get current user | Bearer Token |
| PUT | `/api/auth/change-password`| Change password | Bearer Token |
| PUT | `/api/auth/profile` | Update profile info | Bearer Token |
| PUT | `/api/auth/resume` | Upload resume/logo | Bearer Token |
| POST | `/api/contact` | Submit contact form | No |
| GET | `/api/jobs` | Browse active jobs | No |
| POST | `/api/jobs` | Post new job | Employer |
| PUT | `/api/jobs/:id` | Update job | Employer |
| GET | `/api/applications/mine` | View my applications | Candidate |
| POST | `/api/applications/apply/:jobId`| Apply to a job | Candidate |
| PUT | `/api/applications/:id/status`| Update status | Employer |

## 🌍 Deployment Guide

### MongoDB Atlas:
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user with read/write access
3. Whitelist IP: `0.0.0.0/0` (allow all for Render)
4. Copy connection string → `MONGO_URI` in backend `.env`

### Backend on Render:
1. Connect GitHub repo to Render
2. New Web Service → select `backend/` folder
3. Build: `npm install` | Start: `npm start`
4. Add all environment variables from `.env.example`
5. Deploy → copy your Render URL

### Frontend on Vercel:
1. Import GitHub repo to Vercel
2. Root directory: `frontend/`
3. Framework: Vite
4. Add env: `VITE_API_URL=https://your-render-url.onrender.com/api`
5. Deploy → copy your Vercel URL
6. Update backend `FRONTEND_URL` env with Vercel URL
7. Redeploy backend

### Gmail App Password Setup:
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Search "App Passwords" → Generate for "Mail"
4. Copy 16-char password → `EMAIL_PASS` in `.env`

## 🔐 Security Features
- **JWT refresh token rotation**: Secure auth flow
- **httpOnly, sameSite cookies**: XSS and CSRF protection
- **Helmet.js**: Strict security headers
- **Rate limiting**: 100 req/15min general, 10 req/15min auth routes
- **MongoDB Sanitization**: NoSQL injection prevention
- **xss-clean**: Cross-site scripting input sanitization
- **HPP**: HTTP Parameter Pollution protection
- **Password Hashing**: Using bcrypt with 12 rounds

## 📱 Screenshots
(Screenshots can be added here)

## 🗺️ Phase Roadmap
- ✅ **Phase 1**: Backend foundation + JWT auth
- ✅ **Phase 2**: Landing page + Auth UI
- ✅ **Phase 3**: Dashboards + APIs
- ✅ **Phase 4**: Email notifications + security polish + deployment

## 👨‍💻 Author
Built with ❤️ as part of internship project.
