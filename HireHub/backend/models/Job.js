const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, required: true },
  locationType: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite'
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true
  },
  category: { type: String, required: true },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    default: 'mid'
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  skills: [String],
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  applicationDeadline: Date,
  status: {
    type: String,
    enum: ['open', 'closed', 'paused', 'draft'],
    default: 'open'
  },
  applicationsCount: { type: Number, default: 0 },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtual fields so the frontend can use old field names
jobSchema.virtual('companyName').get(function () {
  return this.company;
});

jobSchema.virtual('jobType').get(function () {
  return this.type;
});

jobSchema.virtual('salaryMin').get(function () {
  return this.salary?.min;
});

jobSchema.virtual('salaryMax').get(function () {
  return this.salary?.max;
});

jobSchema.virtual('remote').get(function () {
  return this.locationType === 'remote';
});

// Ensure virtuals are included in JSON and Object output
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

jobSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

jobSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
