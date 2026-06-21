const mongoose = require('mongoose');

const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

const stripHtml = (html) => {
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
};

const seedRealJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hirehub');
    console.log('MongoDB Connected for Real Data Seeding');

    // Find employer to assign jobs to
    const employer = await User.findOne({ role: 'employer' });
    if (!employer) {
      console.log('Please run node seed.js first to create the base users.');
      process.exit(1);
    }

    console.log('Fetching real jobs from Remotive API...');
    const response = await fetch('https://remotive.com/api/remote-jobs?limit=100');
    const data = await response.json();
    const jobs = data.jobs;

    console.log(`Fetched ${jobs.length} jobs. Formatting and inserting...`);

    const formattedJobs = jobs.map((job, index) => {
      // Map job type
      let type = 'full-time';
      if (job.job_type === 'contract' || job.job_type === 'freelance' || job.job_type === 'part_time' || job.job_type === 'internship') {
        type = job.job_type.replace('_', '-');
      }

      // Randomize experience level
      const levels = ['entry', 'mid', 'senior', 'lead'];
      const expLevel = levels[Math.floor(Math.random() * levels.length)];

      // Randomize salary between 50000 and 150000 if not provided
      let minSalary = 50000 + Math.floor(Math.random() * 50000);
      let maxSalary = minSalary + 20000 + Math.floor(Math.random() * 50000);

      return {
        title: job.title,
        description: stripHtml(job.description).substring(0, 3000), // limit length just in case
        company: job.company_name,
        location: job.candidate_required_location || 'Remote - Worldwide',
        locationType: 'remote',
        type: type,
        category: job.category || 'Software Development',
        experienceLevel: expLevel,
        salary: {
          min: minSalary,
          max: maxSalary,
          currency: 'USD'
        },
        skills: job.tags ? job.tags.slice(0, 7) : ['Remote', 'Tech'],
        requirements: [
          'Strong communication skills',
          'Self-motivated and able to work independently',
          'Experience in relevant technologies'
        ],
        responsibilities: [
          'Develop and maintain high-quality work',
          'Collaborate with remote team members',
          'Participate in code reviews and team meetings'
        ],
        benefits: [
          'Fully remote work',
          'Flexible hours',
          'Health insurance coverage'
        ],
        status: 'open',
        postedBy: employer._id
      };
    });

    await Job.insertMany(formattedJobs);
    console.log(`✅ Successfully inserted ${formattedJobs.length} real jobs into the database!`);
    
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedRealJobs();
