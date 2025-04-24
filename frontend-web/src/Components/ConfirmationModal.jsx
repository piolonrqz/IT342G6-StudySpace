import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { useState } from "react";

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?", // Default title
  description = "This action cannot be undone.", // Default description
  confirmText = "Confirm", // Default confirm button text
  cancelText = "Cancel", // Default cancel button text
  isLoading = false, // Optional loading state for confirm button
  showReasonField = false, // New prop to control showing reason field
  reasonLabel = "Reason (optional)", // Label for the reason field
}) => {
  const [reason, setReason] = useState("");

  // Wrap the onConfirm to pass the reason
  const handleConfirm = () => {
    onConfirm(reason);
    setReason(""); // Reset the reason after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { 
      if (!open) {
        setReason(""); // Reset reason when dialog closes
        onClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {showReasonField && (
          <div className="py-2">
            <label 
              htmlFor="cancellation-reason" 
              className="text-sm font-medium mb-2 block"
            >
              {reasonLabel}
            </label>
            <Textarea
              id="cancellation-reason"
              placeholder="Why are you cancelling this booking?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24"
            />
          </div>
        )}
        
        <DialogFooter className="sm:justify-end gap-2"> 
          <DialogClose asChild> 
            <Button type="button" variant="outline">
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};