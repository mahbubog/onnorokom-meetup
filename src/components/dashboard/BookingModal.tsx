import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  selectedSlot: { roomId: string; time: string } | null;
  selectedDate: Date;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  selectedSlot,
  selectedDate,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    startTime: selectedSlot?.time || '',
    endTime: '',
    repeat: 'no-repeat',
    remarks: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Meeting title is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      toast({
        title: "Validation Error",
        description: "Start and end times are required",
        variant: "destructive"
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Validation Error",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Mock booking creation - in real app would make API call
    setTimeout(() => {
      toast({
        title: "Booking Successful",
        description: `Meeting "${formData.title}" has been booked successfully`,
      });
      onSuccess();
      setIsLoading(false);
    }, 1000);
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Meeting Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter meeting title"
        />
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <div className="p-2 bg-muted rounded-md text-sm">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Select value={formData.startTime} onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Select value={formData.endTime} onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="repeat">Repeat</Label>
        <Select value={formData.repeat} onValueChange={(value) => setFormData(prev => ({ ...prev, repeat: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-repeat">No repeat</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
          placeholder="Additional notes or requirements"
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-primary" disabled={isLoading}>
          {isLoading ? 'Booking...' : 'Book Meeting'}
        </Button>
      </div>
    </form>
  );
};