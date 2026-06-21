const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

const indianLocations = [
  'Bangalore, India',
  'Mumbai, India',
  'Pune, India',
  'Hyderabad, India',
  'Chennai, India',
  'Delhi NCR, India',
  'Gurgaon, India',
  'Noida, India',
  'Remote, India'
];

const techCompanies = [
  'Tata Consultancy Services',
  'Infosys',
  'Wipro',
  'HCL Technologies',
  'Tech Mahindra',
  'Flipkart',
  'Zomato',
  'Swiggy',
  'Paytm',
  'Ola Cabs',
  'Zoho',
  'Freshworks',
  'Razorpay',
  'Cred',
  'Dream11',
  'Postman',
  'BrowserStack',
  'Udaan',
  'ShareChat',
  'Pine Labs'
];

const updateJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hirehub');
    console.log('MongoDB Connected. Updating jobs...');

    // Create a bunch of fake employer users so jobs have different postedBy
    const employers = [];
    for (let i = 0; i < 15; i++) {
      const company = techCompanies[i];
      let user = await User.findOne({ email: `hr${i}@${company.toLowerCase().replace(/\s/g, '')}.com` });
      if (!user) {
        user = await User.create({
          name: `${company} HR`,
          email: `hr${i}@${company.toLowerCase().replace(/\s/g, '')}.com`,
          password: 'password123', // dummy password, hashes in pre-save
          role: 'employer',
          companyName: company,
          companyDescription: `Leading technology solutions provider in India. Join ${company} to build scalable products.`,
          industry: 'Information Technology',
          companySize: '1000+ employees',
          companyWebsite: `https://www.${company.toLowerCase().replace(/\s/g, '')}.com`
        });
      }
      employers.push(user);
    }

    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs to update.`);

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const randomEmployer = employers[Math.floor(Math.random() * employers.length)];
      const randomLocation = indianLocations[Math.floor(Math.random() * indianLocations.length)];
      
      job.company = randomEmployer.companyName;
      job.postedBy = randomEmployer._id;
      job.location = randomLocation;
      
      await job.save();
    }

    console.log('✅ Successfully updated all jobs with Indian locations and varied companies!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateJobs();
