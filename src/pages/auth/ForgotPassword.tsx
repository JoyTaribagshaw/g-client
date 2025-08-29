import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setError('root', {
        type: 'manual',
        message: 'Failed to send password reset email. Please try again.',
      });
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title={
          <div className="flex items-center justify-center">
            <img 
              src="/src/assets/azubi_logo.png" 
              alt="Azubi Logo" 
              className="h-12 w-auto mr-3"
            />
            <span>Check your email</span>
          </div>
        }
        subtitle={
          <>
            We've sent you an email with instructions to reset your password.
            <br />
            <span className="text-sm text-gray-600">
              Didn't receive an email?{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Try again
              </button>
            </span>
          </>
        }
      >
        <div className="mt-6">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={
        <div className="flex items-center justify-center">
          <img 
            src="/src/assets/azubi_logo.png" 
            alt="Azubi Logo" 
            className="h-12 w-auto mr-3"
          />
          <span>Reset your password</span>
        </div>
      }
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
        </button>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending reset link...' : 'Send reset link'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
