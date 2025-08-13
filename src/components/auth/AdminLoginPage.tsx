import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield } from 'lucide-react';

export const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    const success = await adminLogin(username, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Admin Branding */}
        <div className="text-white space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Shield className="h-12 w-12" />
              <h1 className="text-4xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-xl text-white/90">OnnoRokom Meeting System</p>
            <p className="text-lg text-white/80 max-w-md">
              Administrative access to manage users, rooms, and system settings
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-white/90 justify-center lg:justify-start">
            <Building2 className="h-5 w-5" />
            <span className="text-sm">System Administration</span>
          </div>
        </div>

        {/* Right side - Admin Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-large bg-gradient-card backdrop-blur-sm border-white/20">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>Sign in with your administrator credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="transition-smooth focus:shadow-soft"
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
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-medium transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In as Admin'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-brand hover:text-brand-secondary transition-smooth"
              >
                Back to User Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};