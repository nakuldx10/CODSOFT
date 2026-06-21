const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()
require('express-async-errors')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const notificationRoutes = require('./routes/notificationRoutes')

const app = express()

// 1. CORS — must be first
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.options('*', cors())

// 2. Body parsers
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// 3. Cookie parser
app.use(cookieParser())

// 4. Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 5. Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/notifications', notificationRoutes)

// 6. Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'HireHub API is running' })
})

// 7. 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// 8. Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
})

// 9. Start
const PORT = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`HireHub server running on port ${PORT}`)
  })
})
