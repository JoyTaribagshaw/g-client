import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import AuthLayout from '../../components/layout/AuthLayout';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function VerifyOTP() {
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { verifyOtp, resendOtp, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || '';
  const from = location.state?.from?.pathname || '/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    // Start countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: OTPFormData) => {
    try {
      const success = await verifyOtp(data.otp);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Invalid OTP. Please try again.',
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('root', {
        type: 'manual',
        message: 'Failed to verify OTP. Please try again.',
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOtp(email);
      setCountdown(30);
      setCanResend(false);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      setError('root', {
        type: 'manual',
        message: 'Failed to resend OTP. Please try again.',
      });
    }
  };

  return (
    <AuthLayout
      title={
        <div className="flex items-center justify-center">
          <img 
            src="/src/assets/azubi_logo.png" 
            alt="Azubi Logo" 
            className="h-12 w-auto mr-3"
          />
          <span>Verify your email</span>
        </div>
      }
      subtitle="We've sent a verification code to your email"
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
            <label htmlFor="otp" className="sr-only">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
              placeholder="000000"
              {...register('otp')}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoading || !canResend}
            className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin h-4 w-4 mr-1" />
                Resending...
              </>
            ) : (
              `Resend code${countdown > 0 ? ` in ${countdown}s` : ''}`
            )}
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

