-- Add missing columns to bookings table for repeat functionality
ALTER TABLE public.bookings 
ADD COLUMN repeat_type text DEFAULT 'no_repeat' CHECK (repeat_type IN ('no_repeat', 'daily', 'weekly', 'monthly', 'custom')),
ADD COLUMN repeat_end_date date,
ADD COLUMN is_recurring boolean DEFAULT false,
ADD COLUMN parent_booking_id uuid;