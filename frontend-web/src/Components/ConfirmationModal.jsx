import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?", // Default title
  description = "This action cannot be undone.", // Default description
  confirmText = "Confirm", // Default confirm button text
  cancelText = "Cancel", // Default cancel button text
  isLoading = false, // Optional loading state for confirm button
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2"> 
          {/* Add the asChild prop back to DialogClose */}
          <DialogClose asChild> 
            <Button type="button" variant="outline">
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};