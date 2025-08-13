import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, Users } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!pin || !password) {
      setError('Please enter both PIN and password');
      setIsLoading(false);
      return;
    }

    const success = await login(pin, password, rememberMe);
    
    if (success) {
      // Navigation will be handled by App.tsx based on user role
      navigate('/dashboard');
    } else {
      setError('Invalid PIN or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Building2 className="h-12 w-12" />
              <h1 className="text-4xl font-bold">OnnoRokom</h1>
            </div>
            <p className="text-xl text-white/90">Meeting Booking System</p>
            <p className="text-lg text-white/80 max-w-md">
              Streamline your meeting room reservations with our intuitive booking platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3 text-white/90">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Secure Access</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Users className="h-5 w-5" />
              <span className="text-sm">Team Management</span>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-large bg-gradient-card backdrop-blur-sm border-white/20">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="text"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="transition-smooth focus:shadow-soft"
                  maxLength={9}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-smooth focus:shadow-soft"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-medium transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-brand hover:text-brand-secondary transition-smooth block mx-auto"
              >
                Forgot your password?
              </button>
              
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="text-brand hover:text-brand-secondary transition-smooth font-medium"
                >
                  Register here
                </button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground pt-2 border-t border-border/50">
                Administrator?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/admin/login')}
                  className="text-brand hover:text-brand-secondary transition-smooth font-medium"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Dialog */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
          </DialogHeader>
          <RegisterForm onSuccess={() => setShowRegister(false)} />
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <ForgotPasswordForm onSuccess={() => setShowForgotPassword(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};