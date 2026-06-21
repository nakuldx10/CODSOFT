const express = require('express')
const router = express.Router()
const { protect, requireRole } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  saveJob,
  getSavedJobs
} = require('../controllers/applicationController')

// SPECIFIC routes MUST come before /:id
router.get('/mine', protect, requireRole('candidate'), getCandidateApplications)
router.get('/saved', protect, requireRole('candidate'), getSavedJobs)
router.post('/save/:jobId', protect, requireRole('candidate'), saveJob)
router.get('/job/:jobId', protect, requireRole('employer'), getJobApplications)
router.post('/:jobId', protect, requireRole('candidate'), upload.single('resume'), applyToJob)
router.put('/:id/status', protect, requireRole('employer'), updateApplicationStatus)

module.exports = router
