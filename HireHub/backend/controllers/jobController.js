const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all open jobs with filtering, sorting, pagination
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const { search, location, jobType, experienceLevel, remote, salaryMin, salaryMax, sort, page = 1, limit = 10 } = req.query;

    let query = { status: 'open' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Schema field is 'type' not 'jobType'
    if (jobType) query.type = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (remote !== undefined && remote === 'true') {
      query.locationType = 'remote';
    }

    // Schema uses salary.min and salary.max
    if (salaryMin) query['salary.min'] = { $gte: Number(salaryMin) };
    if (salaryMax) query['salary.max'] = { $lte: Number(salaryMax) };

    let sortOption = { createdAt: -1 }; // newest default
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'highSalary') sortOption = { 'salary.max': -1 };
    if (sort === 'lowSalary') sortOption = { 'salary.min': 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('postedBy', 'name companyName companyLogo');

    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs,
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / Number(limit))
    });
  } catch (error) {
    console.error('getAllJobs error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name companyName companyLogo companyWebsite companyDescription industry');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error('getJobById error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const jobData = { ...req.body };
    jobData.postedBy = req.user.id;
    
    // Map frontend field names to schema field names
    if (jobData.jobType && !jobData.type) {
      jobData.type = jobData.jobType;
      delete jobData.jobType;
    }
    if (jobData.companyName && !jobData.company) {
      jobData.company = jobData.companyName;
      delete jobData.companyName;
    }
    if (!jobData.company) {
      jobData.company = req.user.companyName || req.user.name;
    }
    if (!jobData.category) {
      jobData.category = 'General';
    }

    const job = await Job.create(jobData);

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('createJob error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error('updateJob error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    
    // Also delete associated applications
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('deleteJob error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/employer/mine
// @access  Private (Employer only)
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error('getEmployerJobs error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle job status (open/closed)
// @route   PUT /api/jobs/:id/status
// @access  Private (Employer only)
const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job.status = job.status === 'open' ? 'closed' : 'open';
    await job.save();

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error('toggleJobStatus error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  toggleJobStatus
};
