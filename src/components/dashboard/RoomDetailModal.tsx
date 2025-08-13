import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wifi, Camera, Mic, Monitor, Plus } from 'lucide-react';
import { BookingModal } from './BookingModal';

interface Room {
  id: string;
  name: string;
  color: string;
  capacity: number;
  features: string[];
  image?: string;
}

interface RoomDetailModalProps {
  room: Room;
  onClose: () => void;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const mockBookings = [
  { time: '10:00-11:30', title: 'Team Meeting', bookedBy: 'John Doe' },
  { time: '14:00-15:00', title: 'Client Call', bookedBy: 'Jane Smith' }
];

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ roomId: string; time: string } | null>(null);

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'video conference':
        return <Camera className="h-4 w-4" />;
      case 'microphone':
        return <Mic className="h-4 w-4" />;
      case 'big screen':
      case 'projector':
        return <Monitor className="h-4 w-4" />;
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const isTimeSlotBooked = (time: string) => {
    return mockBookings.some(booking => booking.time.includes(time));
  };

  const handleTimeSlotClick = (time: string) => {
    if (!isTimeSlotBooked(time)) {
      setSelectedSlot({ roomId: room.id, time });
      setShowBookingModal(true);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Room Header */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: room.color }}
              />
              <h2 className="text-xl font-semibold">{room.name}</h2>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Users className="h-4 w-4" />
              <span>Capacity: {room.capacity} people</span>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h3 className="font-medium">Features & Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {room.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                    {getFeatureIcon(feature)}
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Room Image Placeholder */}
          <div className="w-40 h-32 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <Monitor className="h-8 w-8 mx-auto mb-2" />
              Room Image
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Available Time Slots
                <div className="text-sm font-normal text-muted-foreground">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {timeSlots.map((time) => {
                  const isBooked = isTimeSlotBooked(time);
                  const booking = mockBookings.find(b => b.time.includes(time));

                  return (
                    <div
                      key={time}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isBooked
                          ? 'bg-muted cursor-not-allowed'
                          : 'hover:bg-muted/50 hover:border-brand'
                      }`}
                      onClick={() => !isBooked && handleTimeSlotClick(time)}
                    >
                      {isBooked ? (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{time}</span>
                            <Badge variant="secondary" style={{ backgroundColor: room.color, color: 'white' }}>
                              Booked
                            </Badge>
                          </div>
                          {booking && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {booking.title} - {booking.bookedBy}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{time}</span>
                          <Plus className="h-4 w-4 text-brand" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book {room.name}</DialogTitle>
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
    </>
  );
};