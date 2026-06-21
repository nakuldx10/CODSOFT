import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  usePageTitle('Register');
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { register: registerAuth, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'candidate' ? '/candidate/dashboard' : '/employer/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'candidate' || roleParam === 'employer') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password', '');

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (pass.length >= 6 && pass.length < 10 && !/[!@#$%^&*]/.test(pass)) {
      return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    }
    return { score: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const pwdStrength = calculatePasswordStrength(password);

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      await registerAuth(data.name, data.email, data.password, selectedRole);
      toast.success('Account created! Welcome to HireHub 🎉');
      if (selectedRole === 'candidate') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/employer/dashboard');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to create account');
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-2xl w-full space-y-8 bg-navy-800 p-8 sm:p-10 rounded-2xl shadow-2xl border border-[#2A2B45] relative z-10">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold text-white">
                Hire<span className="text-primary">Hub</span>
              </span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-[#8B8FA8]">Join thousands of professionals on HireHub</p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-medium text-white mb-6 text-center">I want to...</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Card */}
              <button
                onClick={() => setSelectedRole('candidate')}
                className="group flex flex-col items-center text-center p-6 border-2 border-[#2A2B45] rounded-xl hover:border-primary transition-colors bg-navy-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Find a Job</h4>
                <p className="text-sm text-[#8B8FA8]">Browse jobs, apply, track applications</p>
              </button>

              {/* Employer Card */}
              <button
                onClick={() => setSelectedRole('employer')}
                className="group flex flex-col items-center text-center p-6 border-2 border-[#2A2B45] rounded-xl hover:border-primary transition-colors bg-navy-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Hire Talent</h4>
                <p className="text-sm text-[#8B8FA8]">Post jobs, review applications, hire</p>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[#8B8FA8]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-navy-800 p-8 sm:p-10 rounded-2xl shadow-2xl border border-[#2A2B45] relative z-10">
        <div className="text-center relative">
          <button
            onClick={() => setSelectedRole(null)}
            className="absolute left-0 top-1 text-gray-400 hover:text-white"
            aria-label="Go back"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-white">
              Hire<span className="text-primary">Hub</span>
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white">Create your account</h2>
          <div className="mt-2 inline-block px-3 py-1 rounded-full bg-navy-900 border border-[#2A2B45] text-xs font-medium text-primary">
            Registering as: {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </div>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-[#8B8FA8] mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className={`appearance-none block w-full px-3 py-2.5 border ${
                errors.name ? 'border-red-500' : 'border-[#2A2B45]'
              } rounded-lg bg-navy-900 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm`}
              placeholder="John Doe"
              {...register('name', { required: 'Full name is required' })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B8FA8] mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`appearance-none block w-full px-3 py-2.5 border ${
                errors.email ? 'border-red-500' : 'border-[#2A2B45]'
              } rounded-lg bg-navy-900 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B8FA8] mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`appearance-none block w-full pr-10 px-3 py-2.5 border ${
                  errors.password ? 'border-red-500' : 'border-[#2A2B45]'
                } rounded-lg bg-navy-900 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            
            {/* Password Strength Indicator */}
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 flex space-x-1 h-1.5">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full ${
                      level <= pwdStrength.score ? pwdStrength.color : 'bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
              <span className={`text-xs w-12 text-right ${pwdStrength.score > 0 ? 'text-gray-300' : 'text-transparent'}`}>
                {pwdStrength.label}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B8FA8] mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className={`appearance-none block w-full px-3 py-2.5 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#2A2B45]'
              } rounded-lg bg-navy-900 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm`}
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === watch('password') || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded bg-navy-900"
                {...register('terms', { required: 'You must agree to the terms' })}
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="terms" className="text-[#8B8FA8]">
                I agree to the <a href="#" className="text-primary hover:text-primary-dark">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-dark">Privacy Policy</a>
              </label>
            </div>
          </div>
          {errors.terms && <p className="mt-0 text-xs text-red-500">{errors.terms.message}</p>}

          {submitError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
              {submitError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-navy-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-[#8B8FA8]">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
