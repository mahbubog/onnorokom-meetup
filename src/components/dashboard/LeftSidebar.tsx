import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface LeftSidebarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Calendar Widget */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Calendar</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          className="rounded-md border shadow-soft"
        />
      </div>

      {/* Layout Filter */}
      <div className="space-y-3">
        <Label className="font-semibold">Layout View</Label>
        <Select value={viewMode} onValueChange={(value: 'daily' | 'weekly') => onViewModeChange(value)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily View</SelectItem>
            <SelectItem value="weekly">Weekly View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>• Click on time slots to book</div>
          <div>• View existing bookings</div>
          <div>• Manage your meetings</div>
        </div>
      </div>
    </div>
  );
};