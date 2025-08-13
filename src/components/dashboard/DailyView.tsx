import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { BookingModal } from './BookingModal';

interface DailyViewProps {
  selectedDate: Date;
}

interface Room {
  id: string;
  name: string;
  color: string;
  capacity: number;
}

interface Booking {
  id: string;
  roomId: string;
  title: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  date: string;
}

const mockRooms: Room[] = [
  { id: '1', name: 'Meeting Room 1', color: '#3B82F6', capacity: 8 },
  { id: '2', name: 'Conference Hall', color: '#10B981', capacity: 20 },
  { id: '3', name: 'Executive Room', color: '#8B5CF6', capacity: 6 },
  { id: '4', name: 'Training Room', color: '#F59E0B', capacity: 15 },
];

const mockBookings: Booking[] = [
  {
    id: '1',
    roomId: '1',
    title: 'Team Standup',
    startTime: '09:00',
    endTime: '10:00',
    bookedBy: 'John Doe',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '2',
    roomId: '2',
    title: 'Client Meeting',
    startTime: '14:00',
    endTime: '15:30',
    bookedBy: 'Jane Smith',
    date: new Date().toISOString().split('T')[0]
  }
];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const DailyView: React.FC<DailyViewProps> = ({ selectedDate }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ roomId: string; time: string } | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isTimeSlotBooked = (roomId: string, time: string) => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return mockBookings.some(booking => 
      booking.roomId === roomId && 
      booking.date === selectedDateStr && 
      booking.startTime <= time && 
      booking.endTime > time
    );
  };

  const getBookingForSlot = (roomId: string, time: string) => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return mockBookings.find(booking => 
      booking.roomId === roomId && 
      booking.date === selectedDateStr && 
      booking.startTime <= time && 
      booking.endTime > time
    );
  };

  const handleSlotClick = (roomId: string, time: string) => {
    if (!isTimeSlotBooked(roomId, time)) {
      setSelectedSlot({ roomId, time });
      setShowBookingModal(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Daily Schedule</h1>
        <p className="text-muted-foreground">{formatDate(selectedDate)}</p>
      </div>

      {/* Schedule Grid */}
      <div className="bg-card rounded-lg border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header Row */}
            <div className="grid grid-cols-[200px_repeat(9,120px)] bg-muted/50">
              <div className="p-4 font-semibold border-r border-border">Rooms</div>
              {timeSlots.map(time => (
                <div key={time} className="p-4 text-center font-medium border-r border-border last:border-r-0">
                  {time}
                </div>
              ))}
            </div>

            {/* Room Rows */}
            {mockRooms.map(room => (
              <div key={room.id} className="grid grid-cols-[200px_repeat(9,120px)] border-b border-border last:border-b-0">
                {/* Room Name Column */}
                <div className="p-4 border-r border-border flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: room.color }}
                  />
                  <div>
                    <div className="font-medium">{room.name}</div>
                    <div className="text-sm text-muted-foreground">Capacity: {room.capacity}</div>
                  </div>
                </div>

                {/* Time Slot Columns */}
                {timeSlots.map(time => {
                  const booking = getBookingForSlot(room.id, time);
                  const isBooked = !!booking;

                  return (
                    <div 
                      key={`${room.id}-${time}`}
                      className="p-2 border-r border-border last:border-r-0 h-20 relative group cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => handleSlotClick(room.id, time)}
                    >
                      {isBooked ? (
                        <div 
                          className="w-full h-full rounded p-2 text-white text-xs flex flex-col justify-center"
                          style={{ backgroundColor: room.color }}
                        >
                          <div className="font-medium truncate">{booking.title}</div>
                          <div className="opacity-90">{booking.bookedBy}</div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Meeting Room</DialogTitle>
          </DialogHeader>
          <BookingModal
            selectedSlot={selectedSlot}
            selectedDate={selectedDate}
            onClose={() => setShowBookingModal(false)}
            onSuccess={() => {
              setShowBookingModal(false);
              // Refresh bookings data
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};