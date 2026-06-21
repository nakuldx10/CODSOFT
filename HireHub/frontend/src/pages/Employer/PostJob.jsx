import { usePageTitle } from '../../hooks/usePageTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import JobPostForm from '../../components/employer/JobPostForm';

const PostJob = () => {
  usePageTitle('Post Job');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await axios.post('/api/jobs', data);
      toast.success('Job posted successfully!');
      navigate('/employer/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Post a New Job</h1>
        <p className="text-text-muted dark:text-[#8B8FA8] mt-1">
          Fill in the details below to attract the right candidates
        </p>
      </div>

      {/* Form */}
      <JobPostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default PostJob;
