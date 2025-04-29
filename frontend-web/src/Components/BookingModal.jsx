import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Loader2, Clock, Users, DollarSign, CalendarDays } from 'lucide-react'; 
import { format } from 'date-fns'; 
import { cn } from "@/lib/utils"; // Import the cn utility
import { format as formatDateFns } from 'date-fns'; // Alias format to avoid conflict

const generateTimeSlots = (openingTime, closingTime, selectedDate) => {
  if (!openingTime || !closingTime) return [];
  
  const slots = [];
  const [openHour, openMinute] = openingTime.split(':').map(Number);
  const [closeHour, closeMinute] = closingTime.split(':').map(Number);
  
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;
  
  const now = new Date();
  const isToday = selectedDate && 
    now.getDate() === selectedDate.getDate() &&
    now.getMonth() === selectedDate.getMonth() &&
    now.getFullYear() === selectedDate.getFullYear();
  
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;
  
  for (let minutes = openMinutes; minutes < closeMinutes; minutes += 60) {
    if (isToday && minutes <= currentMinutes) {
      continue;
    }
    
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const timeString = `${formattedHour}:${formattedMinute}`;
    
    const displayHour = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayTime = `${displayHour}:${formattedMinute.padStart(2, '0')} ${ampm}`;
    
    slots.push({ value: timeString, label: displayTime });
  }
  
  return slots;
};

const timeToMinutes = (timeString) => {
  if (!timeString || !timeString.includes(':')) return null;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatLocalDateTime = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const BookingModal = ({ isOpen, onClose, space }) => {
  const { toast } = useToast();
  const { user, token, isAuthenticated } = useAuth();
  
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [participants, setParticipants] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [slotAvailability, setSlotAvailability] = useState({}); 
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotLoadingError, setSlotLoadingError] = useState(null);
  const [unavailableSlotTimes, setUnavailableSlotTimes] = useState([]);

  const timeSlots = useMemo(() => 
    generateTimeSlots(space?.openingTime, space?.closingTime, date),
    [space?.openingTime, space?.closingTime, date] 
  );

  useEffect(() => {
    setStartTime(""); 
    setSlotAvailability({}); 
    setUnavailableSlotTimes([]); // Clear unavailable times
    setIsLoadingSlots(true); 
    setSlotLoadingError(null); 
  }, [date, space?.id]); 

  useEffect(() => {
    const fetchBookingsAndSetAvailability = async () => {
      if (!date || !space?.id || !token || timeSlots.length === 0) {
        setIsLoadingSlots(false);
        return;
      }

      setIsLoadingSlots(true);
      setSlotLoadingError(null);
      setSlotAvailability({}); // Clear previous availability
      setUnavailableSlotTimes([]); // Clear previous unavailable times

      try {
        // Format date as YYYY-MM-DD for the API endpoint
        const dateString = formatDateFns(date, 'yyyy-MM-dd');
        
        // Call the new endpoint to get existing bookings for the day
        const response = await fetch(`https://it342g6-studyspace.onrender.com/api/bookings/space/${space.id}/date/${dateString}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Handle potential errors like 401, 404, 500
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch bookings: ${response.status}`);
        }

        const existingBookings = await response.json();
        
        // Convert fetched booking times (which are likely strings) to Date objects for comparison
        const bookedIntervals = existingBookings.map(booking => ({
            start: new Date(booking.startTime),
            end: new Date(booking.endTime)
        }));

        const availabilityResults = {};
        const unavailableTimes = [];

        // Now, check each generated time slot against the fetched bookings
        timeSlots.forEach(slot => {
          const [startHour, startMinute] = slot.value.split(':').map(Number);
          const slotStartDate = new Date(date);
          slotStartDate.setHours(startHour, startMinute, 0, 0);
          
          // Check 1-hour duration from the slot start time
          const slotEndDate = new Date(slotStartDate);
          slotEndDate.setHours(slotStartDate.getHours() + 1); 

          let isAvailable = true;

          // Check if slot is in the past
          if (slotStartDate < new Date()) {
              isAvailable = false;
          } else {
              // Check for overlap with existing bookings
              for (const interval of bookedIntervals) {
                  // Overlap condition: (SlotStart < IntervalEnd) and (SlotEnd > IntervalStart)
                  if (slotStartDate < interval.end && slotEndDate > interval.start) {
                      isAvailable = false;
                      break; // Found an overlap, no need to check further
                  }
              }
          }

          availabilityResults[slot.value] = isAvailable;
          if (!isAvailable) {
            unavailableTimes.push(slotStartDate); // Store the start time Date object if unavailable
          }
        });

        setSlotAvailability(availabilityResults);
        unavailableTimes.sort((a, b) => a.getTime() - b.getTime());
        setUnavailableSlotTimes(unavailableTimes);

      } catch (error) {
          console.error("Error fetching bookings or setting availability:", error);
          setSlotLoadingError(error.message || "Could not load time slot availability. Please try again.");
          // Set all slots as unavailable on error
          const fallbackAvailability = {};
          timeSlots.forEach(slot => { fallbackAvailability[slot.value] = false; }); 
          setSlotAvailability(fallbackAvailability);
          setUnavailableSlotTimes([]); 
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchBookingsAndSetAvailability();
  }, [date, space?.id, timeSlots, token]); 

  const totalPrice = space ? parseFloat(space.price) * parseInt(duration) : 0;
  
  const disabledDays = { before: new Date() };

  const calculatedEndTime = useMemo(() => {
    if (!date || !startTime || !duration) {
      return null;
    }
    try {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const startDate = new Date(date);
      startDate.setHours(startHour, startMinute, 0, 0); 
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + parseInt(duration));
      
      return format(endDate, 'h:mm a'); 
    } catch (error) {
      console.error("Error calculating end time:", error);
      return null;
    }
  }, [date, startTime, duration]);

  const availableDurations = useMemo(() => {
    const standardDurations = [1, 2, 3, 4, 5, 6, 7, 8]; // Use 1-8 hours

    if (!startTime || !space?.closingTime) {
      return []; // Return empty if no start time or closing time
    }
    
    const startMinutes = timeToMinutes(startTime);
    const closingMinutes = timeToMinutes(space.closingTime);
    
    if (startMinutes === null || closingMinutes === null) {
      return []; // Return empty on parsing error
    }
    
    // Max duration based on closing time
    const maxDurationClosing = Math.floor((closingMinutes - startMinutes) / 60);

    // Find max duration based on the next unavailable slot
    let maxDurationNextBooking = Infinity; 
    try {
        const selectedStartTimeObj = new Date(date);
        const [startHour, startMinute] = startTime.split(':').map(Number);
        selectedStartTimeObj.setHours(startHour, startMinute, 0, 0);

        // Find the first unavailable slot *after* the selected start time
        const nextUnavailableSlot = unavailableSlotTimes.find(
            unavailableTime => unavailableTime.getTime() > selectedStartTimeObj.getTime()
        );

        if (nextUnavailableSlot) {
            const diffMillis = nextUnavailableSlot.getTime() - selectedStartTimeObj.getTime();
            maxDurationNextBooking = Math.floor(diffMillis / (1000 * 60 * 60)); // Calculate hours difference
        }
    } catch (e) {
        console.error("Error calculating time difference for next booking:", e);
        // Keep maxDurationNextBooking as Infinity if error occurs
    }

    // Final max duration is the minimum of the two constraints
    const maxAllowedDuration = Math.min(maxDurationClosing, maxDurationNextBooking);
    
    // Filter the standard durations [1, 2, 3, 4, 5, 6, 7, 8]
    return standardDurations.filter(d => d > 0 && d <= maxAllowedDuration);
    
  }, [startTime, space?.closingTime, date, unavailableSlotTimes]); // Add dependencies

  useEffect(() => {
    if (startTime && !availableDurations.includes(duration)) {
      setDuration(availableDurations[0] || 1); 
    }
  }, [startTime, duration, availableDurations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!startTime) {
         toast({
             title: "Missing Information",
             description: "Please select a start time.",
             variant: "destructive"
         });
         return;
     }
     if (availableDurations.length === 0 || !availableDurations.includes(duration)) {
         toast({
             title: "Invalid Duration",
             description: "The selected duration is not valid for the chosen start time.",
             variant: "destructive"
         });
         return;
     }
    
    setIsSubmitting(true);
    
    try {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      
      const startDate = new Date(date); 
      startDate.setHours(startHour, startMinute, 0, 0); 
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + parseInt(duration)); 
      
      const startDateTime = formatLocalDateTime(startDate);
      const endDateTime = formatLocalDateTime(endDate);

      const bookingData = {
        userId: user.id,
        spaceId: space.id,
        startTime: startDateTime, 
        endTime: endDateTime,     
        duration: parseInt(duration),
        participants: parseInt(participants),
        purpose: purpose,
        totalPrice: totalPrice
      };
      
      const response = await fetch(`https://it342g6-studyspace.onrender.com/api/bookings/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to create booking';
        if (response.status === 409) {
           try {
             const errorData = await response.json();
             errorMessage = errorData.error || "The selected time slot became unavailable.";
           } catch (parseError) {
             errorMessage = "The selected time slot became unavailable.";
           }
        } else if (response.status === 400) { 
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || "Invalid booking request.";
            } catch (parseError) {
                errorMessage = "Invalid booking request.";
            }
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = 'Authentication error. Please log in again.';
        } else {
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
  
  const isConfirmDisabled = isSubmitting || isLoadingSlots || !startTime || availableDurations.length === 0; 
  
  // Format the current date for display
  const formattedDate = format(date, "MMMM d, yyyy");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 bg-[#f9fcff]">
          <DialogTitle className="text-xl font-semibold text-[#2F9FE5]">Book {space?.name}</DialogTitle>
          <DialogDescription className="text-base text-gray-600"> 
            Select your preferred date, time, and duration to reserve this space.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          {/* Calendar section with enhanced styling */}
          <div className="space-y-3">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-[#2F9FE5]" />
              <Label htmlFor="date" className="text-base font-medium">Select Date</Label>
            </div>
            <div className="bg-[#f9fcff] rounded-lg p-2">
              <Calendar
                id="date"
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={disabledDays}
                className="rounded-md mx-auto"
              />
            </div>
          </div>
          
          {/* Time selection with enhanced styling */}
          <div className="space-y-3">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#2F9FE5]" />
              <Label htmlFor="time" className="text-base font-medium">Start Time</Label>
            </div>
            <Select 
              value={startTime} 
              onValueChange={(value) => {
                  setStartTime(value);
              }}
              disabled={isLoadingSlots || timeSlots.length === 0 || !!slotLoadingError} 
            >
              <SelectTrigger id="time" className="h-11">
                <SelectValue>
                  {isLoadingSlots ? "Loading times..." : 
                   slotLoadingError ? "Error loading times" :
                   startTime ? timeSlots.find(slot => slot.value === startTime)?.label || startTime : 
                   "Select time"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {isLoadingSlots ? (
                  <div className="p-3 text-center text-sm text-gray-500 flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking availability...
                  </div>
                ) : slotLoadingError ? (
                   <div className="p-3 text-center text-sm text-red-600">
                     {slotLoadingError}
                   </div>
                ) : timeSlots.length === 0 ? (
                  <div className="p-3 text-center text-sm text-gray-500">
                    No available slots for this day.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {timeSlots.map((slot) => {
                      const isDisabled = slotAvailability[slot.value] === false;
                      return (
                        <SelectItem
                          key={slot.value}
                          value={slot.value}
                          disabled={isDisabled}
                          className={cn(
                            "py-2.5 px-3 rounded-md mb-1 text-center justify-center", 
                            isDisabled ? "bg-gray-100 text-gray-400" : "hover:bg-[#ebf6fc] hover:text-[#2F9FE5]",
                            startTime === slot.value && "bg-[#ebf6fc] text-[#2F9FE5] font-medium"
                          )}
                        >
                          {slot.label}
                        </SelectItem>
                      );
                    })}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Duration selection with enhanced styling */}
          <div className="space-y-3">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#2F9FE5]" />
              <Label htmlFor="duration" className="text-base font-medium">Duration</Label>
            </div>
            <Select 
                value={duration.toString()} 
                onValueChange={(val) => {
                    setDuration(parseInt(val));
                }}
                disabled={!startTime || availableDurations.length === 0} 
            >
              <SelectTrigger id="duration" className="h-11">
                <SelectValue placeholder={!startTime ? "Select start time first" : "Select duration"} />
              </SelectTrigger>
              <SelectContent>
                {availableDurations.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {availableDurations.map((hours) => (
                      <SelectItem key={hours} value={hours.toString()} className={cn(
                        "py-2.5 px-3 rounded-md mb-1 text-center justify-center",
                        duration === hours && "bg-[#ebf6fc] text-[#2F9FE5] font-medium"
                      )}>
                        {hours} {hours === 1 ? 'hour' : 'hours'}
                      </SelectItem>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500">
                    No valid durations for selected start time.
                  </div>
                )}
              </SelectContent>
            </Select>
            {calculatedEndTime && startTime && availableDurations.length > 0 && (
              <p className="text-sm text-gray-600 mt-1 ml-1">
                Ends at: <span className="font-medium">{calculatedEndTime}</span>
              </p>
            )}
          </div>
          
          {/* Participants with enhanced styling */}
          <div className="space-y-3">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-[#2F9FE5]" />
              <Label htmlFor="participants" className="text-base font-medium">Number of Participants</Label>
            </div>
            <Input
              id="participants"
              type="number"
              min="1"
              max={space?.capacity || 10}
              value={participants}
              onChange={(e) => setParticipants(parseInt(e.target.value))}
              className="h-11"
            />
            {space?.capacity && (
              <p className="text-sm text-gray-600 ml-1">Maximum capacity: {space.capacity} people</p>
            )}
          </div>
          
          {/* Price summary with enhanced styling */}
          <div className="bg-[#f9fcff] p-4 rounded-lg mt-4 border border-[#e1eef9]">
            <div className="flex justify-between text-gray-600 mb-2">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>Rate:</span>
              </div>
              <span>₱{space?.price}/hour</span>
            </div>
            <div className="flex justify-between font-semibold text-[#2F9FE5]">
              <span>Total:</span>
              <span>₱{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1 h-11">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isConfirmDisabled} 
              className={cn("flex-1 h-11 bg-[#2F9FE5] hover:bg-[#2387c9]", isSubmitting && "opacity-70")}
            >
              {isSubmitting ? "Processing..." : 
               isLoadingSlots ? "Loading..." : 
               !startTime ? "Select Time" :
               "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;