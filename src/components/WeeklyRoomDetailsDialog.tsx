import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO, addMinutes, isBefore, isAfter, isSameDay, startOfWeek, addDays, differenceInMinutes, startOfDay } from "date-fns"; // Added startOfDay
import { Plus } from "lucide-react";
import { Room, Booking } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface WeeklyRoomDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  initialDate: Date;
  dailyBookingsForSelectedRoomAndDate: Booking[]; // New prop
  onBookSlot: (roomId: string, date: Date, startTime: string, endTime: string) => void;
  onViewBooking: (booking: Booking) => void;
}

// Helper to generate 30-minute time slots based on room's available time
const generateDynamic30MinSlots = (room: Room) => {
  const slots = [];
  const start = room.available_time?.start || "00:00";
  const end = room.available_time?.end || "23:59";

  let currentTime = parseISO(`2000-01-01T${start}:00`);
  const endTime = parseISO(`2000-01-01T${end}:00`);

  // Ensure the loop includes the end time if it's on a 30-minute boundary
  while (isBefore(currentTime, endTime) || isSameDay(currentTime, endTime)) {
    slots.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, 30);
  }
  return slots;
};

// Helper to generate hourly labels based on room's available time
const generateDynamicHourlyLabels = (room: Room) => {
  const labels = [];
  const start = room.available_time?.start || "00:00";
  const end = room.available_time?.end || "23:59";

  const startHour = parseInt(start.substring(0, 2));
  const endHour = parseInt(end.substring(0, 2));
  const endMinute = parseInt(end.substring(3, 5));

  // The last hour label should correspond to the start of the last full hour available
  // If end time is 17:00, last label is 4 PM. If end time is 17:30, last label is 5 PM.
  let actualEndHourForLabels = endHour;
  if (endMinute === 0 && endHour > startHour) { // If end is exactly on the hour, the label for that hour's start is not needed
    actualEndHourForLabels = endHour - 1;
  }

  for (let i = startHour; i <= actualEndHourForLabels; i++) {
    labels.push(format(parseISO(`2000-01-01T${i.toString().padStart(2, '0')}:00:00`), "h a"));
  }
  return labels;
};

// Helper to convert HH:MM to minutes from midnight
const timeToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const WeeklyRoomDetailsDialog: React.FC<WeeklyRoomDetailsDialogProps> = ({
  open,
  onOpenChange,
  room,
  initialDate,
  dailyBookingsForSelectedRoomAndDate, // Destructure new prop
  onBookSlot,
  onViewBooking,
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  // Use the prop directly instead of fetching
  const roomBookings = dailyBookingsForSelectedRoomAndDate;

  // Generate dynamic time slots and hourly labels based on room's available time
  const dynamic30MinSlots = room ? generateDynamic30MinSlots(room) : [];
  const dynamicHourlyLabels = room ? generateDynamicHourlyLabels(room) : [];

  // No need for useEffect to fetch bookings here anymore, as they are passed as prop
  useEffect(() => {
    setSelectedDate(initialDate); // Ensure selectedDate updates if initialDate changes
  }, [initialDate]);


  const handleEmptySlotClick = (slotTime: string) => {
    if (!room || !selectedDate) return;

    const isPastDate = isBefore(startOfDay(selectedDate), startOfDay(new Date()));
    if (isPastDate) {
      toast({
        title: "Booking Not Allowed",
        description: "Cannot book for past dates.",
        variant: "destructive",
      });
      return;
    }

    // Check if the clicked 30-min slot is within the room's available time
    const slotStartMinutes = timeToMinutes(slotTime);
    const roomStartMinutes = room.available_time ? timeToMinutes(room.available_time.start) : 0;
    const roomEndMinutes = room.available_time ? timeToMinutes(room.available_time.end) : (24 * 60);

    if (slotStartMinutes < roomStartMinutes || slotStartMinutes >= roomEndMinutes) {
      toast({
        title: "Unavailable Time",
        description: `This time slot is outside the room's available hours (${room.available_time?.start || '00:00'} - ${room.available_time?.end || '23:59'}).`,
        variant: "destructive",
      });
      return;
    }

    // Check for overlapping bookings for the proposed 1-hour slot
    const potentialBookingStart = parseISO(`2000-01-01T${slotTime}:00`);
    const potentialBookingEnd = addMinutes(potentialBookingStart, 60); // Default to 1-hour slot for new booking

    const hasConflict = roomBookings.some(booking => {
      const existingBookingStart = parseISO(`2000-01-01T${booking.start_time}`);
      const existingBookingEnd = parseISO(`2000-01-01T${booking.end_time}`);

      // Check for overlap: (start1 < end2) && (end1 > start2)
      return isBefore(potentialBookingStart, existingBookingEnd) && isAfter(potentialBookingEnd, existingBookingStart);
    });

    if (hasConflict) {
      toast({
        title: "Booking Conflict",
        description: "This time slot is already booked for this room.",
        variant: "destructive",
      });
      return;
    }

    // If no conflict and within available time, proceed to book
    onBookSlot(room.id, selectedDate, slotTime, format(potentialBookingEnd, "HH:mm"));
    onOpenChange(false); // Close this dialog after initiating booking
  };

  const handleBookingCardClick = (booking: Booking) => {
    // Show details of the existing booking using the shared BookingDetailsDialog
    onViewBooking(booking);
    onOpenChange(false); // Close this dialog
  };

  if (!room) {
    return null;
  }

  // Generate dates for current and next week
  const startOfCurrentWeek = startOfWeek(selectedDate || new Date(), { weekStartsOn: 0 }); // Sunday as start of week
  const currentWeekDates = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
  const nextWeekDates = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, 7 + i));

  const isPastSelectedDate = isBefore(startOfDay(selectedDate || new Date()), startOfDay(new Date()));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-x-auto overflow-y-auto">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-center">{room.name}</DialogTitle>
        </DialogHeader>

        {/* Room Image with Overlay for Capacity & Facilities */}
        {room.image && (
          <div className="relative mb-4 px-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <img src={room.image} alt={room.name} className="w-full h-48 object-cover rounded-md" />
            <div className="absolute bottom-4 left-6 text-white p-2 rounded-md bg-black/50">
              <p className="text-sm font-semibold">
                Capacity {room.capacity || "N/A"}, Facilities {room.facilities || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* Date Range Display (as per screenshot) */}
        <div className="px-6 mb-4 flex items-center justify-center text-gray-700 dark:text-gray-300">
          <span className="font-semibold">{format(currentWeekDates[0], "MMM dd, yyyy")}</span>
          <span className="mx-2">-</span>
          <span className="font-semibold">{format(currentWeekDates[6], "MMM dd, yyyy")}</span>
        </div>

        {/* Custom Date Selector (Current and Next Week) */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {currentWeekDates.map((date) => (
              <span key={`day-name-${format(date, 'yyyy-MM-dd')}`}>{format(date, "EEE")}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {currentWeekDates.map((date) => (
              <Button
                key={`date-current-${format(date, 'yyyy-MM-dd')}`}
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full w-9 h-9",
                  isSameDay(date, selectedDate || new Date()) && "bg-blue-500 text-white hover:bg-blue-600"
                )}
                onClick={() => setSelectedDate(date)}
              >
                {format(date, "d")}
              </Button>
            ))}
            {nextWeekDates.map((date) => (
              <Button
                key={`date-next-${format(date, 'yyyy-MM-dd')}`}
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full w-9 h-9",
                  isSameDay(date, selectedDate || new Date()) && "bg-blue-500 text-white hover:bg-blue-600"
                )}
                onClick={() => setSelectedDate(date)}
              >
                {format(date, "d")}
              </Button>
            ))}
          </div>
        </div>

        {/* Time Slots Grid with Single Scrollbar */}
        <div className="flex-1 px-6 pb-4">
          <div className="grid grid-cols-[60px_1fr] border border-gray-200 dark:border-gray-700 rounded-md relative min-w-[500px]">
            {/* Left Column: Time Labels (fixed height, aligns with hourly cells) */}
            <div className="flex flex-col">
              {dynamicHourlyLabels.map((label, _index) => (
                <div
                  key={`time-label-${label}`}
                  className="h-[60px] flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-r border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Right Column: Booking Slots and Empty Cells */}
            <div className="relative flex-1">
              {dynamic30MinSlots.map((slotTime, index) => {
                const slotStartDateTime = parseISO(`2000-01-01T${slotTime}:00`);

                // Determine if this 30-min slot is covered by any booking
                const coveringBooking = roomBookings.find(booking => {
                  const existingBookingStart = parseISO(`2000-01-01T${booking.start_time}`);
                  const existingBookingEnd = parseISO(`2000-01-01T${booking.end_time}`);
                  const slotEndDateTime = addMinutes(slotStartDateTime, 30);
                  return isBefore(slotStartDateTime, existingBookingEnd) && isAfter(slotEndDateTime, existingBookingStart);
                });

                const canBookSlot = !isPastSelectedDate; // Only allow booking if it's not a past date

                // Only render the background cell if it's NOT covered by a booking
                if (!coveringBooking) {
                  return (
                    <div
                      key={`empty-slot-${slotTime}`}
                      className={cn(
                        "h-[30px] flex items-center justify-center p-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0",
                        canBookSlot ? "bg-gray-50 dark:bg-gray-700/20 group hover:bg-gray-100 dark:hover:bg-gray-700/40 cursor-pointer" : "bg-gray-100 dark:bg-gray-700/10 cursor-not-allowed opacity-60"
                      )}
                      onClick={canBookSlot ? () => handleEmptySlotClick(slotTime) : undefined}
                      style={{ top: `${index * 30}px`, position: 'absolute', left: 0, right: 0 }}
                    >
                      <Plus className={cn("h-5 w-5 text-gray-400", canBookSlot ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-50")} />
                    </div>
                  );
                }
                return null; // Do not render background for covered slots
              })}

              {/* Render all booking cards on top */}
              {roomBookings.map(booking => {
                const bookingStart = parseISO(`2000-01-01T${booking.start_time}`);
                const bookingEnd = parseISO(`2000-01-01T${booking.end_time}`);
                const durationMinutes = differenceInMinutes(bookingEnd, bookingStart);
                const heightPx = (durationMinutes / 30) * 30; // Each 30-min slot is 30px high

                // Calculate top position based on the start time relative to the first dynamic slot
                const firstSlotTime = dynamic30MinSlots[0];
                const firstSlotStart = parseISO(`2000-01-01T${firstSlotTime}:00`);
                const offsetMinutes = differenceInMinutes(bookingStart, firstSlotStart);
                const topPx = (offsetMinutes / 30) * 30;

                return (
                  <div
                    key={`booking-${booking.id}`}
                    className="absolute left-0 right-0 p-1 rounded-md text-white cursor-pointer transition-colors duration-200 overflow-hidden flex flex-col justify-center items-center mx-[2px]"
                    style={{
                      backgroundColor: room.color || "#888",
                      top: `${topPx}px`,
                      height: `${heightPx}px`,
                      zIndex: 10, // Ensure booking is above empty slots
                    }}
                    onClick={() => handleBookingCardClick(booking)}
                  >
                    <span className="font-medium text-center leading-tight text-xs truncate w-full px-1">
                      {booking.title}
                    </span>
                    <span className="text-[10px] text-center opacity-90 mt-1">
                      {format(bookingStart, "h:mma")} - {format(bookingEnd, "h:mma")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyRoomDetailsDialog;