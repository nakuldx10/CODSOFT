const express = require('express')
const router = express.Router()
const { protect, requireRole } = require('../middleware/authMiddleware')
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  toggleJobStatus
} = require('../controllers/jobController')

// SPECIFIC routes MUST come before /:id
router.get('/employer/mine', protect, requireRole('employer'), getEmployerJobs)
router.get('/', getAllJobs)
router.post('/', protect, requireRole('employer'), createJob)
router.get('/:id', getJobById)
router.put('/:id/status', protect, requireRole('employer'), toggleJobStatus)
router.put('/:id', protect, requireRole('employer'), updateJob)
router.delete('/:id', protect, requireRole('employer'), deleteJob)

module.exports = router
