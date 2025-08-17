import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO, isBefore, addMinutes, isSameDay, startOfDay } from "date-fns"; // Added startOfDay
import { CalendarIcon, Clock, Text, Repeat, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Room, Booking } from "@/types/database";
import { cn } from "@/lib/utils";

export const generateTimeOptions = (roomAvailableStart?: string, roomAvailableEnd?: string) => {
  const options = [];
  const defaultStart = "00:00";
  const defaultEnd = "23:59";

  const startHour = parseInt((roomAvailableStart || defaultStart).substring(0, 2));
  const startMinute = parseInt((roomAvailableStart || defaultStart).substring(3, 5));
  const endHour = parseInt((roomAvailableEnd || defaultEnd).substring(0, 2));
  const endMinute = parseInt((roomAvailableEnd || defaultEnd).substring(3, 5));

  let currentTime = parseISO(`2000-01-01T${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`);
  const endTime = parseISO(`2000-01-01T${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`);

  while (isBefore(currentTime, endTime) || isSameDay(currentTime, endTime)) {
    options.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, 30);
  }
  return options;
};

// Helper to convert HH:MM to minutes from midnight
const timeToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const formSchema = z.object({
  title: z.string().min(1, "Meeting title is required"),
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  repeatType: z.enum(["no_repeat", "daily", "weekly", "monthly", "custom"]).default("no_repeat"),
  endDate: z.date().optional(), // Required if repeatType is 'custom'
  remarks: z.string().optional(),
}).refine((data) => {
  const startDateTime = parseISO(`2000-01-01T${data.startTime}:00`);
  const endDateTime = parseISO(`2000-01-01T${data.endTime}:00`);
  return isBefore(startDateTime, endDateTime);
}, {
  message: "End time must be after start time",
  path: ["endTime"],
}).refine((data) => {
  if (data.repeatType === "custom" && !data.endDate) {
    return false;
  }
  return true;
}, {
  message: "End date is required for custom repeat",
  path: ["endDate"],
}).refine((data) => {
  // New validation: Cannot book for past dates
  const today = startOfDay(new Date());
  const selected = startOfDay(data.date);
  return isSameDay(selected, today) || isBefore(today, selected); // Allow today or future dates
}, {
  message: "Cannot book for past dates",
  path: ["date"],
});

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  selectedDate: Date;
  initialStartTime?: string;
  initialEndTime?: string;
  existingBooking?: Booking | null;
  onBookingSuccess: () => void;
  userId: string;
}

const BookingFormDialog: React.FC<BookingFormDialogProps> = ({
  open,
  onOpenChange,
  room,
  selectedDate,
  initialStartTime,
  initialEndTime,
  existingBooking,
  onBookingSuccess,
  userId,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: selectedDate,
      startTime: initialStartTime || "09:00",
      endTime: initialEndTime || "10:00",
      repeatType: "no_repeat",
      remarks: "",
    },
  });

  useEffect(() => {
    if (room) {
      setTimeOptions(generateTimeOptions(room.available_time?.start, room.available_time?.end));
    } else {
      setTimeOptions(generateTimeOptions()); // Default full day if no room selected
    }
  }, [room]);

  useEffect(() => {
    if (open && room) {
      if (existingBooking) {
        // Edit mode: populate form with existing booking data
        form.reset({
          title: existingBooking.title,
          date: parseISO(existingBooking.date),
          startTime: existingBooking.start_time.substring(0, 5), // HH:MM
          endTime: existingBooking.end_time.substring(0, 5),     // HH:MM
          repeatType: "no_repeat", // Assuming repeats are handled separately or not editable via this form for simplicity
          remarks: existingBooking.remarks || "",
        });
      } else {
        // New booking mode: populate with initial values
        form.reset({
          title: "",
          date: selectedDate,
          startTime: initialStartTime || "09:00",
          endTime: initialEndTime || "10:00",
          repeatType: "no_repeat",
          remarks: "",
        });
      }
    }
  }, [open, room, selectedDate, initialStartTime, initialEndTime, existingBooking, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!room) {
      toast({ title: "Error", description: "No room selected.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const formattedDate = format(values.date, "yyyy-MM-dd");
    
    // Validate against room's available time using minute-based comparison
    if (room.available_time) {
      const bookingStartMinutes = timeToMinutes(values.startTime);
      const bookingEndMinutes = timeToMinutes(values.endTime);
      const roomStartMinutes = timeToMinutes(room.available_time.start);
      const roomEndMinutes = timeToMinutes(room.available_time.end);

      if (bookingStartMinutes < roomStartMinutes || bookingEndMinutes > roomEndMinutes) {
        toast({
          title: "Booking Error",
          description: `Booking must be within room's available hours: ${room.available_time.start} - ${room.available_time.end}.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Check for overlapping bookings using explicit time comparisons
      let query = supabase
        .from('bookings')
        .select('id')
        .eq('room_id', room.id)
        .eq('date', formattedDate)
        .filter('start_time', 'lt', values.endTime) // New booking starts before existing ends
        .filter('end_time', 'gt', values.startTime); // New booking ends after existing starts

      if (existingBooking) {
        query = query.neq('id', existingBooking.id); // Exclude current booking in edit mode
      }

      const { data: conflicts, error: conflictError } = await query;

      if (conflictError) throw conflictError;

      if (conflicts && conflicts.length > 0) {
        toast({
          title: "Booking Conflict",
          description: "The selected time slot overlaps with an existing booking in this room.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (existingBooking) {
        // Update existing booking
        const { error } = await supabase
          .from('bookings')
          .update({
            title: values.title,
            date: formattedDate,
            start_time: values.startTime,
            end_time: values.endTime,
            remarks: values.remarks,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingBooking.id);

        if (error) throw error;

        toast({ title: "Booking Updated", description: "Meeting booking updated successfully." });
      } else {
        // Create new booking
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            user_id: userId,
            room_id: room.id,
            title: values.title,
            date: formattedDate,
            start_time: values.startTime,
            end_time: values.endTime,
            remarks: values.remarks,
            repeat_type: values.repeatType,
            repeat_end_date: values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
            is_recurring: values.repeatType !== "no_repeat",
          })
          .select()
          .single();

        if (error) throw error;

        // If it's a repeating booking, call the Edge Function
        if (values.repeatType !== "no_repeat" && data) {
          const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke(
            'generate-repeated-bookings',
            {
              body: JSON.stringify({
                initialBooking: {
                  id: data.id, // Pass the ID of the initial booking
                  user_id: userId,
                  room_id: room.id,
                  title: values.title,
                  date: formattedDate,
                  start_time: values.startTime,
                  end_time: values.endTime,
                  remarks: values.remarks,
                },
                repeatType: values.repeatType,
                endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
                userId: userId,
              }),
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (edgeFunctionError) {
            console.error("Error invoking Edge Function:", edgeFunctionError);
            toast({
              title: "Repeat Booking Error",
              description: `Failed to generate repeated bookings: ${edgeFunctionError.message}`,
              variant: "destructive",
            });
          } else {
            console.log("Edge Function response:", edgeFunctionData);
            toast({ title: "Repeat Bookings Generated", description: `${edgeFunctionData.count} additional bookings created.` });
          }
        }

        toast({ title: "Booking Confirmed", description: "Meeting booked successfully!" });
      }

      onBookingSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Booking Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Ensure submitting state is reset
    }
  };

  const repeatType = form.watch("repeatType");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingBooking ? "Edit Meeting" : "Book New Meeting"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomName" className="text-right col-span-1">Room</Label>
            <Input id="roomName" value={room?.name || ""} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right flex items-center col-span-1">
              <Text className="inline-block mr-1 h-4 w-4" /> Title
            </Label>
            <Input id="title" placeholder="Meeting Title" {...form.register("title")} className="col-span-3" />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm col-span-4 text-right">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right flex items-center col-span-1">
              <CalendarIcon className="inline-block mr-1 h-4 w-4" /> Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !form.watch("date") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("date") ? format(form.watch("date"), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch("date")}
                  onSelect={(date) => form.setValue("date", date!)}
                  initialFocus
                  disabled={(date) => isBefore(date, startOfDay(new Date()))} // Disable past dates
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.date && (
              <p className="text-red-500 text-sm col-span-4 text-right">{form.formState.errors.date.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right flex items-center col-span-1">
              <Clock className="inline-block mr-1 h-4 w-4" /> Start
            </Label>
            <Select onValueChange={(value) => form.setValue("startTime", value)} value={form.watch("startTime")}>
              <SelectTrigger id="startTime" className="col-span-3">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.startTime && (
              <p className="text-red-500 text-sm col-span-4 text-right">{form.formState.errors.startTime.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right flex items-center col-span-1">
              <Clock className="inline-block mr-1 h-4 w-4" /> End
            </Label>
            <Select onValueChange={(value) => form.setValue("endTime", value)} value={form.watch("endTime")}>
              <SelectTrigger id="endTime" className="col-span-3">
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.endTime && (
              <p className="text-red-500 text-sm col-span-4 text-right">{form.formState.errors.endTime.message}</p>
            )}
          </div>
          {!existingBooking && ( // Hide repeat options in edit mode for simplicity
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="repeatType" className="text-right flex items-center col-span-1">
                  <Repeat className="inline-block mr-1 h-4 w-4" /> Repeat
                </Label>
                <Select onValueChange={(value: "no_repeat" | "daily" | "weekly" | "monthly" | "custom") => form.setValue("repeatType", value)} value={repeatType}>
                  <SelectTrigger id="repeatType" className="col-span-3">
                    <SelectValue placeholder="No repeat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_repeat">No Repeat</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom End Date</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.repeatType && (
                  <p className="text-red-500 text-sm col-span-4 text-right">{form.formState.errors.repeatType.message}</p>
                )}
              </div>
              {(repeatType === "daily" || repeatType === "weekly" || repeatType === "monthly" || repeatType === "custom") && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right flex items-center col-span-1">
                    <CalendarIcon className="inline-block mr-1 h-4 w-4" /> End Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !form.watch("endDate") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("endDate") ? format(form.watch("endDate")!, "PPP") : <span>Pick end date (Optional)</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.watch("endDate")}
                        onSelect={(date) => form.setValue("endDate", date!)}
                        initialFocus
                        disabled={(date) => isBefore(date, startOfDay(new Date()))} // Disable past dates
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.endDate && (
                    <p className="text-red-500 text-sm col-span-4 text-right">{form.formState.errors.endDate.message}</p>
                  )}
                </div>
              )}
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remarks" className="text-right flex items-center col-span-1">
              <Info className="inline-block mr-1 h-4 w-4" /> Remarks
            </Label>
            <Input id="remarks" placeholder="Optional remarks" {...form.register("remarks")} className="col-span-3" />
            {form.formState.errors.remarks && (
              <p className="text-red-500 text-sm col-span-4 text-right">{form.formState.errors.remarks.message}</p>
            )}
          </div>
          <DialogFooter className="col-span-full">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (existingBooking ? "Saving..." : "Booking...") : (existingBooking ? "Save Changes" : "Book Meeting")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormDialog;