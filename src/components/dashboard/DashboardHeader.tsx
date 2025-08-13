import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Building2, Calendar, HelpCircle, Share, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { ProfileModal } from './ProfileModal';

export const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showProfile, setShowProfile] = useState(false);

  const handleTodayClick = () => {
    // This would update the calendar to today's date
    toast({
      title: "Calendar Updated",
      description: "Switched to today's date",
    });
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast({
      title: "URL Copied",
      description: "System URL copied to clipboard",
    });
  };

  const handleHelpClick = () => {
    // Open help modal or navigate to help page
    toast({
      title: "Help",
      description: "Help documentation will open in a new tab",
    });
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shadow-soft">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          onClick={handleTodayClick}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Today
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {currentDate}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Company Logo */}
        <div className="flex items-center gap-2 text-brand font-semibold">
          <Building2 className="h-5 w-5" />
          <span>OnnoRokom Group</span>
        </div>

        {/* Action Buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHelpClick}
          className="hover:bg-muted"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleShareClick}
          className="hover:bg-muted"
        >
          <Share className="h-5 w-5" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowProfile(true)}>
              <User className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          <ProfileModal onClose={() => setShowProfile(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};