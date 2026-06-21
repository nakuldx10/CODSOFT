import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Common
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';

// Landing & Auth
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Shared
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';

// Candidate Side
import CandidateSidebar from './components/candidate/CandidateSidebar';
import CandidateDashboard from './pages/Candidate/Dashboard';
import BrowseJobs from './pages/Candidate/BrowseJobs';
import JobDetail from './pages/Candidate/JobDetail';
import AppliedJobs from './pages/Candidate/AppliedJobs';
import SavedJobs from './pages/Candidate/SavedJobs';
import CandidateProfile from './pages/Candidate/CandidateProfile';
import CandidateNotifications from './pages/Candidate/Notifications';

// Employer Side
import EmployerSidebar from './components/employer/EmployerSidebar';
import EmployerDashboard from './pages/Employer/Dashboard';
import PostJob from './pages/Employer/PostJob';
import ManageJobs from './pages/Employer/ManageJobs';
import Applications from './pages/Employer/Applications';
import CompanyProfile from './pages/Employer/CompanyProfile';
import EmployerNotifications from './pages/Employer/Notifications';

const LandingLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <LandingPage />
    </main>
    <Footer />
  </div>
);

const CandidateLayout = ({ children }) => (
  <div className="flex min-h-screen bg-page-bg dark:bg-[#0D0E21] text-text-primary dark:text-[#F1F1F5]">
    <CandidateSidebar />
    <main className="flex-1 md:ml-64 pt-16 md:pt-0 overflow-y-auto min-h-screen relative">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);

const EmployerLayout = ({ children }) => (
  <div className="flex min-h-screen bg-page-bg dark:bg-[#0D0E21] text-text-primary dark:text-[#F1F1F5]">
    <EmployerSidebar />
    <main className="flex-1 md:ml-64 pt-16 md:pt-0 overflow-y-auto min-h-screen relative">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Candidate Routes */}
          <Route path="/candidate/*" element={
            <ProtectedRoute role="candidate">
              <CandidateLayout>
                <Routes>
                  <Route path="dashboard" element={<CandidateDashboard />} />
                  <Route path="jobs" element={<BrowseJobs />} />
                  <Route path="jobs/:id" element={<JobDetail />} />
                  <Route path="applied" element={<AppliedJobs />} />
                  <Route path="saved" element={<SavedJobs />} />
                  <Route path="profile" element={<CandidateProfile />} />
                  <Route path="notifications" element={<CandidateNotifications />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CandidateLayout>
            </ProtectedRoute>
          } />

          {/* Employer Routes */}
          <Route path="/employer/*" element={
            <ProtectedRoute role="employer">
              <EmployerLayout>
                <Routes>
                  <Route path="dashboard" element={<EmployerDashboard />} />
                  <Route path="post-job" element={<PostJob />} />
                  <Route path="jobs" element={<ManageJobs />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="profile" element={<CompanyProfile />} />
                  <Route path="notifications" element={<EmployerNotifications />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </EmployerLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow flex items-center justify-center">
                <NotFound />
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
