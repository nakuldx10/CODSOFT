import { usePageTitle } from '../../hooks/usePageTitle';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const LandingPage = () => {
  usePageTitle('Landing Page');
  const [activeTab, setActiveTab] = useState('candidates');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitContact = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to send message');
      }
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredJobs = [
    { id: 1, title: 'Senior React Developer', company: 'TechCorp', location: 'Remote', type: 'Full-time', salary: '₹18-25 LPA', tag: 'Hot', logo: 'TC' },
    { id: 2, title: 'Product Designer', company: 'DesignStudio', location: 'Bangalore', type: 'Full-time', salary: '₹12-18 LPA', tag: 'New', logo: 'DS' },
    { id: 3, title: 'Node.js Backend Engineer', company: 'CloudBase', location: 'Hyderabad', type: 'Full-time', salary: '₹15-22 LPA', tag: 'Remote', logo: 'CB' },
    { id: 4, title: 'Data Analyst', company: 'DataMinds', location: 'Mumbai', type: 'Contract', salary: '₹8-12 LPA', tag: 'Urgent', logo: 'DM' },
    { id: 5, title: 'DevOps Engineer', company: 'InfraScale', location: 'Remote', type: 'Full-time', salary: '₹20-30 LPA', tag: 'Hot', logo: 'IS' },
    { id: 6, title: 'Flutter Developer', company: 'MobileFirst', location: 'Delhi', type: 'Internship', salary: '₹30-50K/mo', tag: 'New', logo: 'MF' },
  ];

  const companies = ['TechCorp', 'DesignStudio', 'CloudBase', 'DataMinds', 'InfraScale', 'MobileFirst', 'BuildIt', 'NexaAI', 'StackWave', 'Orion Tech', 'DeepMind India', 'PixelForge'];

  return (
    <div className="bg-page-bg dark:bg-[#0D0E21] min-h-screen text-text-primary dark:text-[#F1F1F5]">
      {/* SECTION 1: HERO */}
      <section id="hero" className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="lg:w-1/2"
            >
              <motion.div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-sm font-medium text-primary">🚀 Trusted by 10,000+ professionals</span>
              </motion.div>
              <motion.h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find Your Dream Job <br />
                <span className="text-accent">Faster Than Ever</span>
              </motion.h1>
              <motion.p className="text-lg text-text-muted dark:text-[#8B8FA8] mb-8 max-w-xl">
                HireHub connects talented candidates with top employers. Search thousands of jobs, apply in one click, and land your next opportunity.
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Link to="/register?role=candidate" className="btn-primary text-center">
                  Browse Jobs
                </Link>
                <Link to="/register?role=employer" className="px-6 py-2.5 rounded-lg border border-border-color dark:border-white font-semibold text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Post a Job
                </Link>
              </motion.div>
              <motion.p className="text-xs text-text-muted dark:text-[#8B8FA8]">
                No credit card required · Free to join
              </motion.p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2 relative w-full h-[400px] hidden md:block"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/30 rounded-full blur-[80px]"></div>
              
              <div className="absolute top-10 right-10 bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] shadow-xl w-72 animate-float z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">TC</div>
                  <div>
                    <h3 className="font-bold text-sm">Senior React Developer</h3>
                    <p className="text-xs text-text-muted dark:text-[#8B8FA8]">TechCorp India</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-text-muted dark:text-[#8B8FA8] mb-4">
                  <span>₹18-25 LPA</span>
                  <span>Remote</span>
                </div>
                <button className="w-full py-2 bg-green-500/10 text-green-500 rounded-lg text-sm font-semibold border border-green-500/20">Apply Now</button>
              </div>

              <div className="absolute bottom-10 left-10 bg-card-bg dark:bg-[#14152E] p-4 rounded-xl border border-border-color dark:border-[#2A2B45] shadow-lg w-64 animate-float-delayed opacity-80 z-0 scale-90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm">DS</div>
                  <div>
                    <h3 className="font-bold text-xs">UI/UX Designer</h3>
                    <p className="text-[10px] text-text-muted dark:text-[#8B8FA8]">Bangalore</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS BAR */}
      <section id="stats" className="py-12 bg-surface-bg dark:bg-[#14152E] border-y border-border-color dark:border-[#2A2B45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border-color dark:divide-[#2A2B45]"
          >
            <div className="text-center px-4">
              <p className="text-4xl font-bold text-primary mb-2">50,000+</p>
              <p className="text-sm text-text-muted dark:text-[#8B8FA8]">Jobs Listed</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
              <p className="text-sm text-text-muted dark:text-[#8B8FA8]">Companies</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-bold text-primary mb-2">1M+</p>
              <p className="text-sm text-text-muted dark:text-[#8B8FA8]">Candidates</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-bold text-primary mb-2">95%</p>
              <p className="text-sm text-text-muted dark:text-[#8B8FA8]">Placement Rate</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: WHY HIREHUB */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HireHub?</h2>
            <p className="text-text-muted dark:text-[#8B8FA8] max-w-2xl mx-auto">Everything you need to find your next opportunity or your next hire.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card-bg dark:bg-[#14152E] p-8 rounded-2xl border border-border-color dark:border-[#2A2B45] hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Job Matching</h3>
              <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Our intelligent system matches your skills and experience to the most relevant opportunities — no more endless scrolling.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card-bg dark:bg-[#14152E] p-8 rounded-2xl border border-border-color dark:border-[#2A2B45] hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">One-Click Applications</h3>
              <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Complete your profile once and apply to any job instantly. Your resume and details are always ready.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card-bg dark:bg-[#14152E] p-8 rounded-2xl border border-border-color dark:border-[#2A2B45] hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Job Alerts</h3>
              <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Get notified the moment a job matching your profile is posted. Never miss an opportunity again.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section id="how" className="py-24 bg-surface-bg dark:bg-[#1C1D3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How HireHub Works</h2>
            <p className="text-text-muted dark:text-[#8B8FA8]">Get hired in 3 simple steps</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-card-bg dark:bg-[#14152E] rounded-lg p-1 border border-border-color dark:border-[#2A2B45]">
              <button 
                onClick={() => setActiveTab('candidates')}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'candidates' ? 'bg-primary text-white' : 'text-text-muted dark:text-[#8B8FA8] hover:text-text-primary dark:hover:text-white'}`}
              >
                For Candidates
              </button>
              <button 
                onClick={() => setActiveTab('employers')}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'employers' ? 'bg-primary text-white' : 'text-text-muted dark:text-[#8B8FA8] hover:text-text-primary dark:hover:text-white'}`}
              >
                For Employers
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-border-color dark:border-[#2A2B45] z-0"></div>

            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10"
            >
              {activeTab === 'candidates' ? (
                <>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30">1</div>
                    <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
                    <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Sign up and build your professional profile. Add your skills, experience, education, and upload your resume.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30">2</div>
                    <h3 className="text-xl font-bold mb-3">Browse & Apply</h3>
                    <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Search thousands of jobs with smart filters. Apply with one click — your profile does the talking.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30">3</div>
                    <h3 className="text-xl font-bold mb-3">Get Hired</h3>
                    <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Track your applications in real-time. Get interview invites and land your dream job.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30">1</div>
                    <h3 className="text-xl font-bold mb-3">Create Company Profile</h3>
                    <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Register as an employer and set up your company profile with logo, description, and industry.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30">2</div>
                    <h3 className="text-xl font-bold mb-3">Post a Job</h3>
                    <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Fill in the job details — title, skills, salary, location, and deadline. Go live in minutes.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30">3</div>
                    <h3 className="text-xl font-bold mb-3">Hire the Best</h3>
                    <p className="text-text-muted dark:text-[#8B8FA8] text-sm leading-relaxed">Review applications, shortlist candidates, schedule interviews, and make your hire.</p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURED JOBS */}
      <section id="jobs" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Jobs</h2>
            <p className="text-text-muted dark:text-[#8B8FA8]">Handpicked opportunities from top companies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredJobs.map((job, idx) => {
              const tagColors = {
                'Hot': 'bg-red-500/10 text-red-500 border-red-500/20',
                'New': 'bg-green-500/10 text-green-500 border-green-500/20',
                'Remote': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                'Urgent': 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              };
              
              return (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card-bg dark:bg-[#14152E] p-6 rounded-xl border border-border-color dark:border-[#2A2B45] hover:border-primary dark:hover:border-primary hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">{job.logo}</div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${tagColors[job.tag]}`}>
                      {job.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{job.title}</h3>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-text-muted dark:text-[#8B8FA8] mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {job.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-color dark:border-[#2A2B45]">
                    <div>
                      <span className="block text-xs text-text-muted dark:text-[#8B8FA8] mb-1">Salary</span>
                      <span className="font-semibold text-sm">{job.salary}</span>
                    </div>
                    <Link to="/register" className="px-4 py-1.5 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-colors">
                      Apply Now
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/register" className="inline-flex items-center font-semibold text-primary hover:text-primary-dark group">
              View All Jobs 
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: COMPANY SPOTLIGHT */}
      <section className="py-16 bg-surface-bg dark:bg-[#14152E] overflow-hidden border-y border-border-color dark:border-[#2A2B45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Trusted by Leading Companies</h2>
          <p className="text-text-muted dark:text-[#8B8FA8]">Join thousands of companies hiring on HireHub</p>
        </div>
        
        <div className="flex flex-col gap-6 relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-bg dark:from-[#14152E] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-bg dark:from-[#14152E] to-transparent z-10"></div>
          
          <div className="animate-marquee">
            <div className="marquee-content gap-4 px-2">
              {companies.map((c, i) => (
                <div key={i} className="flex-none px-6 py-3 bg-card-bg dark:bg-[#1C1D3A] rounded-full border border-border-color dark:border-[#2A2B45] text-text-muted dark:text-[#8B8FA8] font-medium text-sm whitespace-nowrap">
                  {c}
                </div>
              ))}
            </div>
            <div className="marquee-content gap-4 px-2">
              {companies.map((c, i) => (
                <div key={i + 'dup'} className="flex-none px-6 py-3 bg-card-bg dark:bg-[#1C1D3A] rounded-full border border-border-color dark:border-[#2A2B45] text-text-muted dark:text-[#8B8FA8] font-medium text-sm whitespace-nowrap">
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-marquee-reverse">
            <div className="marquee-content gap-4 px-2">
              {companies.slice().reverse().map((c, i) => (
                <div key={i} className="flex-none px-6 py-3 bg-card-bg dark:bg-[#1C1D3A] rounded-full border border-border-color dark:border-[#2A2B45] text-text-muted dark:text-[#8B8FA8] font-medium text-sm whitespace-nowrap">
                  {c}
                </div>
              ))}
            </div>
            <div className="marquee-content gap-4 px-2">
              {companies.slice().reverse().map((c, i) => (
                <div key={i + 'dup2'} className="flex-none px-6 py-3 bg-card-bg dark:bg-[#1C1D3A] rounded-full border border-border-color dark:border-[#2A2B45] text-text-muted dark:text-[#8B8FA8] font-medium text-sm whitespace-nowrap">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-text-muted dark:text-[#8B8FA8]">Real stories from real people</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card-bg dark:bg-[#14152E] p-8 rounded-2xl border border-border-color dark:border-[#2A2B45]"
            >
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <p className="italic text-text-muted dark:text-[#8B8FA8] mb-8">"I applied to 5 jobs on HireHub and got 3 interview calls within a week. The platform is incredibly easy to use and the job matches were spot on."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">RS</div>
                <div>
                  <h4 className="font-bold text-sm">Rahul Sharma</h4>
                  <p className="text-xs text-text-muted dark:text-[#8B8FA8]">Software Engineer</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card-bg dark:bg-[#14152E] p-8 rounded-2xl border border-border-color dark:border-[#2A2B45]"
            >
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <p className="italic text-text-muted dark:text-[#8B8FA8] mb-8">"We posted a job on HireHub and received 40 quality applications in 48 hours. The applicant management dashboard saved us hours of work."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">PM</div>
                <div>
                  <h4 className="font-bold text-sm">Priya Mehta</h4>
                  <p className="text-xs text-text-muted dark:text-[#8B8FA8]">HR Manager, TechCorp</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card-bg dark:bg-[#14152E] p-8 rounded-2xl border border-border-color dark:border-[#2A2B45]"
            >
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <p className="italic text-text-muted dark:text-[#8B8FA8] mb-8">"The profile builder is brilliant. Once I filled in my skills and portfolio, relevant jobs started appearing immediately. Got hired in 2 weeks!"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">AK</div>
                <div>
                  <h4 className="font-bold text-sm">Amit Kumar</h4>
                  <p className="text-xs text-text-muted dark:text-[#8B8FA8]">UI/UX Designer</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CONTACT US */}
      <section id="contact" className="py-24 bg-surface-bg dark:bg-[#1C1D3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-text-muted dark:text-[#8B8FA8]">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Info */}
            <div className="lg:w-1/3">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <p className="text-text-muted dark:text-[#8B8FA8]">support@hirehub.io</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <p className="text-text-muted dark:text-[#8B8FA8]">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Address</h4>
                    <p className="text-text-muted dark:text-[#8B8FA8] leading-relaxed">4th Floor, TechPark,<br />Gurugram, Haryana 122001</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="font-bold mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-card-bg dark:bg-[#14152E] flex items-center justify-center text-text-muted dark:text-[#8B8FA8] hover:text-primary transition-colors border border-border-color dark:border-[#2A2B45]">In</a>
                  <a href="#" className="w-10 h-10 rounded-full bg-card-bg dark:bg-[#14152E] flex items-center justify-center text-text-muted dark:text-[#8B8FA8] hover:text-primary transition-colors border border-border-color dark:border-[#2A2B45]">Tw</a>
                  <a href="#" className="w-10 h-10 rounded-full bg-card-bg dark:bg-[#14152E] flex items-center justify-center text-text-muted dark:text-[#8B8FA8] hover:text-primary transition-colors border border-border-color dark:border-[#2A2B45]">Ig</a>
                </div>
              </div>
              <p className="mt-6 text-sm text-text-muted dark:text-[#8B8FA8]">We typically respond within 24 hours.</p>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-card-bg dark:bg-[#14152E] p-8 rounded-2xl border border-border-color dark:border-[#2A2B45] shadow-xl">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmitContact)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-muted dark:text-[#8B8FA8] mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className={`w-full px-4 py-3 rounded-lg bg-surface-bg dark:bg-navy-900 border ${errors.name ? 'border-red-500' : 'border-border-color dark:border-[#2A2B45]'} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                        placeholder="John Doe"
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted dark:text-[#8B8FA8] mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className={`w-full px-4 py-3 rounded-lg bg-surface-bg dark:bg-navy-900 border ${errors.email ? 'border-red-500' : 'border-border-color dark:border-[#2A2B45]'} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                        placeholder="you@example.com"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                        })}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted dark:text-[#8B8FA8] mb-1">Subject</label>
                    <input 
                      type="text" 
                      className={`w-full px-4 py-3 rounded-lg bg-surface-bg dark:bg-navy-900 border ${errors.subject ? 'border-red-500' : 'border-border-color dark:border-[#2A2B45]'} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="How can we help you?"
                      {...register('subject', { required: 'Subject is required' })}
                    />
                    {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted dark:text-[#8B8FA8] mb-1">Message</label>
                    <textarea 
                      rows="4"
                      className={`w-full px-4 py-3 rounded-lg bg-surface-bg dark:bg-navy-900 border ${errors.message ? 'border-red-500' : 'border-border-color dark:border-[#2A2B45]'} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none`}
                      placeholder="Your message here..."
                      {...register('message', { required: 'Message is required' })}
                    ></textarea>
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 disabled:opacity-50">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
