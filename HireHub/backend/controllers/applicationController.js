const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendApplicationConfirmation, sendNewApplicationAlert, sendStatusUpdateEmail } = require('../utils/emailService');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Check if already applied
    const existing = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    const user = await User.findById(req.user.id);
    let resumeFile = user.resume;

    if (req.file) {
      resumeFile = req.file.filename;
      user.resume = resumeFile;
      await user.save();
    } else if (!resumeFile) {
      return res.status(400).json({ success: false, message: 'A resume is required to apply' });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      coverLetter: req.body.coverLetter || '',
      resume: resumeFile
    });

    job.applicationsCount += 1;
    await job.save();

    // Create notification for employer
    await Notification.create({
      user: job.postedBy,
      type: 'application',
      title: 'New Application',
      message: `New application for ${job.title} from ${user.name}`,
      link: `/employer/applications?jobId=${jobId}`
    });

    try {
      const employer = await User.findById(job.postedBy);
      sendApplicationConfirmation(user, job);
      if (employer) {
        sendNewApplicationAlert(employer, user, job);
      }
    } catch (e) {
      console.error('Email notification error:', e);
    }

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('applyToJob error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/mine
// @access  Private (Candidate only)
const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate({
        path: 'job',
        select: 'title companyName companyLogo location jobType salaryMin salaryMax status postedBy',
        populate: { path: 'postedBy', select: 'name companyName' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('getCandidateApplications error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get job's applications
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email avatar headline skills resume socialLinks phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('getJobApplications error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, employerNote } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const validStatuses = ['Pending', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    application.status = status;
    if (employerNote !== undefined) {
      application.employerNote = employerNote;
    }
    
    await application.save();

    // Create notification for candidate
    let notifTitle = 'Application Status Updated';
    let notifMessage = `Your application for ${application.job.title} status changed to ${status}`;
    let notifType = 'status_update';

    if (status === 'Under Review') {
      notifMessage = `Your application for ${application.job.title} is under review`;
    } else if (status === 'Interview Scheduled') {
      notifTitle = 'Interview Scheduled';
      notifMessage = `Congratulations! Interview scheduled for ${application.job.title}`;
      notifType = 'interview';
    } else if (status === 'Selected') {
      notifTitle = 'Application Successful';
      notifMessage = `🎉 You have been selected for ${application.job.title}!`;
    } else if (status === 'Rejected') {
      notifMessage = `Your application for ${application.job.title} was not selected this time`;
    }

    await Notification.create({
      user: application.candidate,
      type: notifType,
      title: notifTitle,
      message: notifMessage,
      link: '/candidate/applied'
    });

    try {
      const candidate = await User.findById(application.candidate);
      if (candidate) {
        sendStatusUpdateEmail(candidate, application.job, status);
      }
    } catch (e) {
      console.error('Email status update error:', e);
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    console.error('updateApplicationStatus error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Save/Unsave a job
// @route   POST /api/applications/save/:jobId
// @access  Private (Candidate only)
const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { jobId } = req.params;

    const jobIndex = user.savedJobs.indexOf(jobId);
    let saved = false;

    if (jobIndex === -1) {
      user.savedJobs.push(jobId);
      saved = true;
    } else {
      user.savedJobs.splice(jobIndex, 1);
    }

    await user.save();
    res.status(200).json({ success: true, saved });
  } catch (error) {
    console.error('saveJob error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get saved jobs
// @route   GET /api/applications/saved
// @access  Private (Candidate only)
const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedJobs',
      populate: { path: 'postedBy', select: 'name companyName companyLogo' }
    });

    res.status(200).json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
    console.error('getSavedJobs error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  saveJob,
  getSavedJobs
};
