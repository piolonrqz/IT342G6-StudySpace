import React, { useState } from 'react';
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

// Helper function to generate time slots based on opening and closing times
const generateTimeSlots = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return [];
  
  const slots = [];
  const [openHour, openMinute] = openingTime.split(':').map(Number);
  const [closeHour, closeMinute] = closingTime.split(':').map(Number);
  
  // Convert to minutes since midnight for easier comparison
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;
  
  // Generate slots in 1-hour increments
  for (let minutes = openMinutes; minutes < closeMinutes; minutes += 60) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    
    // Format as HH:MM
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const timeString = `${formattedHour}:${formattedMinute}`;
    
    // Format for display (12-hour with AM/PM)
    const displayHour = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayTime = `${displayHour}:${formattedMinute.padStart(2, '0')} ${ampm}`;
    
    slots.push({ value: timeString, label: displayTime });
  }
  
  return slots;
};

const BookingModal = ({ isOpen, onClose, space }) => {
  const { toast } = useToast();
  const { user, token, isAuthenticated } = useAuth();
  
  // State for booking form
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [participants, setParticipants] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate time slots based on space's operating hours
  const timeSlots = generateTimeSlots(space?.openingTime, space?.closingTime);

  // Calculate total price based on duration and space price
  const totalPrice = space ? parseFloat(space.price) * parseInt(duration) : 0;
  
  // Disable dates before today
  const disabledDays = { before: new Date() };
  
  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a space.",
        variant: "destructive"
      });
      return;
    }
    
    if (!startTime) {
      toast({
        title: "Missing information",
        description: "Please select a start time.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
        // Create proper JavaScript Date objects
      const [startHour, startMinute] = startTime.split(':').map(Number);
      
      // Create start date
      const startDate = new Date(date);
      startDate.setHours(startHour, startMinute, 0);
      
      // Create end date by cloning start date and adding duration
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + parseInt(duration));
      
      // Format dates for backend in ISO format (YYYY-MM-DDTHH:MM:SS)
      const startDateTime = startDate.toISOString().slice(0, 19);
      const endDateTime = endDate.toISOString().slice(0, 19);
      const bookingData = {
        userId: user.id,
        spaceId: space.id,
        // bookingDate: formattedDate, // Keep or remove based on backend DTO - assuming startTime/endTime are sufficient
        startTime: startDateTime, // Send combined date and time
        endTime: endDateTime,     // Send combined date and time
        duration: parseInt(duration),
        participants: parseInt(participants),
        purpose: purpose,
        totalPrice: totalPrice,
        status: "PENDING"
      };
      
      // Using the correct endpoint and mode: 'cors'
      const response = await fetch('http://localhost:8080/api/bookings/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'include',
        body: JSON.stringify(bookingData)
      });
      
      // Handle different types of errors
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication error. Please log in again.');
        }
        
        // Try to parse the error message from the response
        let errorMessage = 'Failed to create booking';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use the response text
          const text = await response.text();
          if (text) errorMessage = text;
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      toast({
        title: "Booking successful!",
        description: `Your booking for ${space.name} has been confirmed.`,
      });
      
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: error.message || "An error occurred while creating your booking.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book {space?.name}</DialogTitle>
          <DialogDescription>
            Fill in the details below to book this space.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Calendar
              id="date"
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDays}
              className="border rounded-md"
            />
          </div>
          
          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Start Time</Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Select value={duration.toString()} onValueChange={(val) => setDuration(parseInt(val))}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((hours) => (
                  <SelectItem key={hours} value={hours.toString()}>
                    {hours} {hours === 1 ? 'hour' : 'hours'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Number of Participants */}
          <div className="space-y-2">
            <Label htmlFor="participants">Number of Participants</Label>
            <Input
              id="participants"
              type="number"
              min="1"
              max={space?.capacity || 10}
              value={participants}
              onChange={(e) => setParticipants(parseInt(e.target.value))}
            />
            {space?.capacity && (
              <p className="text-xs text-gray-500">Maximum capacity: {space.capacity}</p>
            )}
          </div>
          
          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Booking</Label>
            <Input
              id="purpose"
              placeholder="e.g., Study group, Team meeting"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          
          {/* Price Summary */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between">
              <span>Rate:</span>
              <span>₱{space?.price}/hour</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₱{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;