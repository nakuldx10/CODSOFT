const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['candidate', 'employer'], required: true },
  phone: String,
  avatar: { type: String, default: '' },
  headline: String,
  bio: String,
  skills: [String],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number
  }],
  experience: [{
    company: String,
    title: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  resume: { type: String, default: '' },
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String
  },
  companyName: String,
  companyWebsite: String,
  companyDescription: String,
  companyLogo: String,
  industry: String,
  refreshToken: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
