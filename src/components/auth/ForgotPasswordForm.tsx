import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onSuccess: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);

  const validateEmail = (email: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);

    // Mock API call - in real app would send OTP to email
    setTimeout(() => {
      toast({
        title: "OTP Sent",
        description: "Please check your email for the OTP code.",
      });
      setStep('otp');
      setIsLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);

    // Mock OTP verification - in real app would verify with backend
    setTimeout(() => {
      // For demo, accept any 6-digit OTP
      if (otp === '123456' || otp.length === 6) {
        setStep('reset');
        setError('');
      } else {
        setOtpAttempts(prev => prev + 1);
        if (otpAttempts >= 2) {
          setError('Too many failed attempts. Please request a new OTP.');
          setStep('email');
          setOtpAttempts(0);
        } else {
          setError('Incorrect OTP. Please try again.');
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Mock password reset - in real app would update password
    setTimeout(() => {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. Please log in with your new password.",
      });
      onSuccess();
      setIsLoading(false);
    }, 1000);
  };

  const handleResendOtp = () => {
    setOtp('');
    setError('');
    setOtpAttempts(0);
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your email.",
    });
  };

  if (step === 'email') {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="transition-smooth"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </form>
    );
  }

  if (step === 'otp') {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground text-center">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit OTP"
            className="text-center text-lg tracking-wider"
            maxLength={6}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <button
          type="button"
          onClick={handleResendOtp}
          className="w-full text-sm text-brand hover:text-brand-secondary transition-smooth"
        >
          Resend OTP
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password (min 6 characters)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Updating Password...' : 'Update Password'}
      </Button>
    </form>
  );
};