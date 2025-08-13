import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Calendar, Users } from 'lucide-react';
import { RoomDetailModal } from './RoomDetailModal';

interface WeeklyViewProps {
  selectedDate: Date;
}

interface Room {
  id: string;
  name: string;
  color: string;
  capacity: number;
  features: string[];
  image?: string;
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
  { 
    id: '1', 
    name: 'Meeting Room 1', 
    color: '#3B82F6', 
    capacity: 8,
    features: ['Projector', 'Whiteboard', 'Video Conference']
  },
  { 
    id: '2', 
    name: 'Conference Hall', 
    color: '#10B981', 
    capacity: 20,
    features: ['Big Screen', 'Sound System', 'Video Conference', 'Microphone']
  },
  { 
    id: '3', 
    name: 'Executive Room', 
    color: '#8B5CF6', 
    capacity: 6,
    features: ['Private', 'Executive Setup', 'Video Conference']
  },
  { 
    id: '4', 
    name: 'Training Room', 
    color: '#F59E0B', 
    capacity: 15,
    features: ['Projector', 'Flip Charts', 'Sound System']
  },
];

const mockBookings: Booking[] = [
  {
    id: '1',
    roomId: '1',
    title: 'Team Work: UX/UI',
    startTime: '09:30',
    endTime: '11:30',
    bookedBy: 'John Doe',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '2',
    roomId: '2',
    title: 'Client Presentation',
    startTime: '14:00',
    endTime: '15:30',
    bookedBy: 'Jane Smith',
    date: new Date().toISOString().split('T')[0]
  }
];

export const WeeklyView: React.FC<WeeklyViewProps> = ({ selectedDate }) => {
  const [showRoomDetail, setShowRoomDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Generate week dates starting from Monday
  const getWeekDates = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  const getBookingsForRoomAndDate = (roomId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockBookings.filter(booking => 
      booking.roomId === roomId && booking.date === dateStr
    );
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetail(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Weekly Schedule</h1>
        <p className="text-muted-foreground">
          Week of {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
          {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Schedule Grid */}
      <div className="bg-card rounded-lg border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header Row */}
            <div className="grid grid-cols-[250px_repeat(7,150px)] bg-muted/50">
              <div className="p-4 font-semibold border-r border-border">Rooms</div>
              {weekDates.map(date => (
                <div key={date.toISOString()} className="p-4 text-center font-medium border-r border-border last:border-r-0">
                  {formatDate(date)}
                </div>
              ))}
            </div>

            {/* Room Rows */}
            {mockRooms.map(room => (
              <div key={room.id} className="grid grid-cols-[250px_repeat(7,150px)] border-b border-border last:border-b-0">
                {/* Room Name Column */}
                <div className="p-4 border-r border-border flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: room.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{room.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {room.capacity} people
                    </div>
                  </div>
                </div>

                {/* Date Columns */}
                {weekDates.map(date => {
                  const bookings = getBookingsForRoomAndDate(room.id, date);
                  
                  return (
                    <div 
                      key={`${room.id}-${date.toISOString()}`}
                      className="p-2 border-r border-border last:border-r-0 min-h-[120px] relative group cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="space-y-1">
                        {bookings.slice(0, 2).map(booking => (
                          <div
                            key={booking.id}
                            className="text-xs p-2 rounded text-white"
                            style={{ backgroundColor: room.color }}
                          >
                            <div className="font-medium truncate">{booking.title}</div>
                            <div className="opacity-90">{booking.startTime} - {booking.endTime}</div>
                          </div>
                        ))}
                        
                        {bookings.length > 2 && (
                          <div className="text-xs text-center text-muted-foreground">
                            +{bookings.length - 2} more
                          </div>
                        )}
                        
                        {bookings.length === 0 && (
                          <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Detail Modal */}
      <Dialog open={showRoomDetail} onOpenChange={setShowRoomDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <RoomDetailModal
              room={selectedRoom}
              onClose={() => setShowRoomDetail(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};