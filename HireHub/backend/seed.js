require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Job = require('./models/Job')
const Application = require('./models/Application')

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB for seeding...')

    // Clear existing data
    await User.deleteMany({})
    await Job.deleteMany({})
    await Application.deleteMany({})
    console.log('Cleared existing data')

    // Create candidates
    const candidate1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@test.com',
      password: 'Test@123',
      role: 'candidate',
      headline: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'MongoDB'],
      phone: '9876543210'
    })

    const candidate2 = await User.create({
      name: 'Priya Mehta',
      email: 'priya@test.com',
      password: 'Test@123',
      role: 'candidate',
      headline: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'CSS'],
      phone: '9876543211'
    })

    // Create employers
    const employer1 = await User.create({
      name: 'Tech Corp HR',
      email: 'techcorp@test.com',
      password: 'Test@123',
      role: 'employer',
      companyName: 'TechCorp India',
      companyWebsite: 'https://techcorp.in',
      companyDescription: 'Leading tech company in India',
      industry: 'Technology'
    })

    const employer2 = await User.create({
      name: 'Design Studio HR',
      email: 'design@test.com',
      password: 'Test@123',
      role: 'employer',
      companyName: 'DesignStudio',
      companyWebsite: 'https://designstudio.in',
      companyDescription: 'Creative design agency',
      industry: 'Design'
    })

    console.log('Users created')

    // Create jobs
    const jobs = await Job.create([
      {
        title: 'Senior React Developer',
        description: 'We are looking for an experienced React developer to join our team. You will work on cutting-edge projects and collaborate with a talented team.',
        responsibilities: ['Build React components', 'Write clean code', 'Code reviews', 'Mentor juniors'],
        requirements: ['3+ years React experience', 'Node.js knowledge', 'MongoDB experience'],
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        salary: { min: 18, max: 25 },
        location: 'Bangalore',
        type: 'full-time',
        locationType: 'remote',
        experienceLevel: 'senior',
        category: 'Engineering',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'open',
        postedBy: employer1._id,
        company: 'TechCorp India',
        applicationsCount: 0
      },
      {
        title: 'Product Designer',
        description: 'Join our creative team as a Product Designer. You will design beautiful and intuitive user interfaces for our products.',
        responsibilities: ['Create wireframes', 'Design UI mockups', 'User research', 'Prototype testing'],
        requirements: ['2+ years design experience', 'Figma proficiency', 'Portfolio required'],
        skills: ['Figma', 'Adobe XD', 'CSS', 'UI/UX'],
        salary: { min: 12, max: 18 },
        location: 'Mumbai',
        type: 'full-time',
        locationType: 'onsite',
        experienceLevel: 'mid',
        category: 'Design',
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'open',
        postedBy: employer2._id,
        company: 'DesignStudio',
        applicationsCount: 0
      },
      {
        title: 'Node.js Backend Engineer',
        description: 'We need a strong backend engineer to build scalable APIs and microservices for our growing platform.',
        responsibilities: ['Build REST APIs', 'Database design', 'Performance optimization', 'Documentation'],
        requirements: ['3+ years Node.js', 'Express.js', 'SQL/NoSQL databases'],
        skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL'],
        salary: { min: 15, max: 22 },
        location: 'Hyderabad',
        type: 'full-time',
        locationType: 'remote',
        experienceLevel: 'senior',
        category: 'Engineering',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'open',
        postedBy: employer1._id,
        company: 'TechCorp India',
        applicationsCount: 0
      },
      {
        title: 'Data Analyst',
        description: 'Looking for a detail-oriented Data Analyst to help us make data-driven decisions.',
        responsibilities: ['Analyze data', 'Create reports', 'Build dashboards', 'Present insights'],
        requirements: ['2+ years analytics', 'Python/R', 'SQL proficiency'],
        skills: ['Python', 'SQL', 'Tableau', 'Excel'],
        salary: { min: 8, max: 12 },
        location: 'Delhi',
        type: 'contract',
        locationType: 'onsite',
        experienceLevel: 'mid',
        category: 'Data',
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'open',
        postedBy: employer2._id,
        company: 'DesignStudio',
        applicationsCount: 0
      },
      {
        title: 'DevOps Engineer',
        description: 'We are hiring a DevOps Engineer to streamline our CI/CD pipelines and cloud infrastructure.',
        responsibilities: ['Manage cloud infra', 'CI/CD pipelines', 'Monitoring', 'Security'],
        requirements: ['3+ years DevOps', 'AWS/GCP', 'Docker/Kubernetes'],
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        salary: { min: 20, max: 30 },
        location: 'Remote',
        type: 'full-time',
        locationType: 'remote',
        experienceLevel: 'senior',
        category: 'Engineering',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'open',
        postedBy: employer1._id,
        company: 'TechCorp India',
        applicationsCount: 0
      },
      {
        title: 'Flutter Developer',
        description: 'Join us as a Flutter Developer to build cross-platform mobile applications.',
        responsibilities: ['Build Flutter apps', 'API integration', 'Testing', 'App store deployment'],
        requirements: ['1+ year Flutter', 'Dart language', 'Mobile development'],
        skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
        salary: { min: 5, max: 8 },
        location: 'Pune',
        type: 'internship',
        locationType: 'onsite',
        experienceLevel: 'entry',
        category: 'Engineering',
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: 'open',
        postedBy: employer2._id,
        company: 'DesignStudio',
        applicationsCount: 0
      }
    ])

    console.log('Jobs created:', jobs.length)

    // Create sample applications
    await Application.create([
      {
        job: jobs[0]._id,
        candidate: candidate1._id,
        resume: 'resume-rahul.pdf',
        coverLetter: 'I am very interested in this position and have 4 years of React experience.',
        status: 'reviewed'
      },
      {
        job: jobs[1]._id,
        candidate: candidate2._id,
        resume: 'resume-priya.pdf',
        coverLetter: 'I have a strong portfolio in product design and would love to join your team.',
        status: 'interview'
      },
      {
        job: jobs[2]._id,
        candidate: candidate1._id,
        resume: 'resume-rahul-backend.pdf',
        coverLetter: 'Backend development is my passion. I have built multiple scalable APIs.',
        status: 'pending'
      }
    ])

    // Update applicant counts
    await Job.findByIdAndUpdate(jobs[0]._id, { applicationsCount: 1 })
    await Job.findByIdAndUpdate(jobs[1]._id, { applicationsCount: 1 })
    await Job.findByIdAndUpdate(jobs[2]._id, { applicationsCount: 1 })

    console.log('Applications created')
    console.log('\n✅ HireHub seed complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Test credentials:')
    console.log('Candidate: rahul@test.com / Test@123')
    console.log('Employer:  techcorp@test.com / Test@123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error.message)
    process.exit(1)
  }
}

seedDB()
