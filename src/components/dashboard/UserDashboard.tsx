import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from './DashboardHeader';
import { LeftSidebar } from './LeftSidebar';
import { DailyView } from './DailyView';
import { WeeklyView } from './WeeklyView';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - 20% width */}
        <div className="w-1/5 border-r border-border bg-card">
          <LeftSidebar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
        
        {/* Main Content - 80% width */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'daily' ? (
            <DailyView selectedDate={selectedDate} />
          ) : (
            <WeeklyView selectedDate={selectedDate} />
          )}
        </div>
      </div>
    </div>
  );
};