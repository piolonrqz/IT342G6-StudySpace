import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { format, parseISO } from 'date-fns';

// Helper to format date/time for display
const formatDisplayDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
        return format(parseISO(dateTimeString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
        console.error("Error formatting date for display:", dateTimeString, error);
        return 'Invalid Date';
    }
};

export const BookingFormModal = ({
  isOpen,
  onClose,
  onSave,
  booking, // The booking object being edited
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    numberOfPeople: 1,
    totalPrice: 0, // Added totalPrice
  });

  // Populate form when booking data is available
  useEffect(() => {
    if (booking) {
      setFormData({
        numberOfPeople: booking.numberOfPeople || 1,
        totalPrice: booking.totalPrice || 0, // Populate totalPrice
      });
    } else {
      // Reset form if no booking
      setFormData({
        numberOfPeople: 1,
        totalPrice: 0, // Reset totalPrice
      });
    }
  }, [booking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass only the fields that can be updated
    onSave({
        numberOfPeople: parseInt(formData.numberOfPeople, 10) || 1, // Ensure it's an integer
        totalPrice: parseFloat(formData.totalPrice) || 0 // Ensure it's a float
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md"> {/* Adjusted width */}
        <DialogHeader>
          <DialogTitle>Edit Booking #{booking?.id}</DialogTitle>
          <DialogDescription>
            Update the participant count or total price for this booking. {/* Updated description */}
          </DialogDescription>
        </DialogHeader>

        {/* Display Read-only info */}
        {booking && (
            <div className="space-y-1 text-sm text-gray-600 border-b pb-3 mb-4">
                <p><strong>User:</strong> {booking.userName} ({booking.userEmail})</p>
                <p><strong>Space:</strong> {booking.spaceName}</p>
                <p><strong>Time:</strong> {formatDisplayDateTime(booking.startTime)} - {formatDisplayDateTime(booking.endTime)}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Number of Participants Input */}
          <div>
            <Label htmlFor="booking-participants">Number of Participants</Label>
            <Input
              id="booking-participants"
              type="number"
              min="1"
              // Consider adding max based on space capacity if available in booking object
              // max={booking?.space?.capacity} // Need space capacity here if validation desired
              value={formData.numberOfPeople}
              onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
              required
            />
             {/* Optionally display space capacity if available */}
             {/* {booking?.space?.capacity && <p className="text-xs text-gray-500 mt-1">Max capacity: {booking.space.capacity}</p>} */}
          </div>

          {/* Total Price Input Added */}
          <div>
            <Label htmlFor="booking-total-price">Total Price (₱)</Label>
            <Input
              id="booking-total-price"
              type="number"
              step="0.01" // Allow decimal values for price
              min="0"
              value={formData.totalPrice}
              onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#2F9FE5] hover:bg-[#2387c9]">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button> {/* Added missing closing tag */}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
