import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for description
import { Checkbox } from "@/components/ui/checkbox"; // Use Checkbox for availability
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Use Select for spaceType

// Define possible space types (should match your backend Enum)
const SPACE_TYPES = ["MEETING_ROOM", "CONFERENCE_ROOM", "OPEN_SPACE"];

export const SpaceFormModal = ({
  isOpen,
  onClose,
  onSave,
  space, // Renamed prop
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "", // Keep as string for input control, convert on save
    spaceType: SPACE_TYPES[0], // Default to first type
    available: true, // Default to true
    openingTime: "08:00", // Default opening time
    closingTime: "20:00", // Default closing time
    price: "",
  });

   // Add state for file handling
   const [selectedFile, setSelectedFile] = useState(null);
   const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (space) {
      setFormData({
        name: space.name || "",
        description: space.description || "",
        location: space.location || "",
        capacity: space.capacity?.toString() || "",
        spaceType: space.spaceType || SPACE_TYPES[0],
        available: space.available !== undefined ? space.available : true,
        openingTime: space.openingTime || "08:00",
        closingTime: space.closingTime || "20:00",
        price: space.price?.toString() || "",
      });
      // Set preview URL if space has an image
      if (space.imageFilename) {
        setPreviewUrl(space.imageFilename); // Use Firebase URL directly
      }
    }
  }, [space]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
     setFormData(prev => ({ ...prev, spaceType: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, available: checked }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation example (add more as needed)
    if (!formData.name || !formData.location || !formData.capacity || !formData.openingTime || !formData.closingTime) {
        alert("Please fill in all required fields (Name, Location, Capacity, Opening Time, Closing Time).");
        return;
    }
    if (isNaN(parseInt(formData.capacity, 10)) || parseInt(formData.capacity, 10) <= 0) {
        alert("Capacity must be a positive number.");
        return;
    }
    const priceValue = parseFloat(formData.price); // Validate price
    if (isNaN(priceValue) || priceValue < 0) { // Price cannot be negative
        alert("Price must be a valid non-negative number.");
        return;
    }
    // Basic time format validation (HH:MM) - you might want a more robust solution
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(formData.openingTime) || !timeRegex.test(formData.closingTime)) {
        alert("Opening and Closing times must be in HH:MM format (e.g., 09:00).");
        return;
    }

    // Create the space data object from the form state
    const spaceDetails = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
        capacity: parseInt(formData.capacity, 10), 
      spaceType: formData.spaceType,
        available: formData.available, 
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
        price: parseFloat(formData.price), 
    };

    // Create FormData object
    const submitFormData = new FormData();

    // Convert the spaceDetails object to a JSON string
    const spaceDetailsJson = JSON.stringify(spaceDetails);
    // Create a Blob from the JSON string with the correct MIME type
    const spaceDataBlob = new Blob([spaceDetailsJson], { type: 'application/json' });

    // Append the Blob to FormData with the key 'spaceData'
    submitFormData.append('spaceData', spaceDataBlob);

    // Append file if selected, with the key 'imageFile'
    if (selectedFile) {
        submitFormData.append('imageFile', selectedFile);
    }

   // Pass FormData to onSave
   onSave(submitFormData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]"> {/* Adjust width if needed */}
        <DialogHeader>
          <DialogTitle>{space ? "Edit Space" : "Add New Space"}</DialogTitle>
          <DialogDescription>
            {space ? "Update the details for this space." : "Fill in the details to create a new space."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2"> {/* Allow scrolling */}
          {/* Name */}
          <div>
            <Label htmlFor="name">Space Name</Label>
            <Input
              id="name"
              name="name" // Add name attribute
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Location */}
           <div>
              <Label htmlFor="location">Location</Label>
              <Input
                  id="location"
                  name="location" // Add name attribute
                  value={formData.location}
                  onChange={handleInputChange}
                  required
              />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description" // Add name attribute
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the space..."
            />
          </div>

          {/* Capacity and Type and Price (Side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          { /* ... Capacity input ... */ }
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity" // Add name attribute
                type="number" // Use number type for better input control
                min="1" // Ensure positive number
                value={formData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="spaceType">Space Type</Label>
              <Select
                 name="spaceType" // Add name attribute (though handled by onValueChange)
                 value={formData.spaceType}
                 onValueChange={handleSelectChange} // Use specific handler
                 required
              >
                <SelectTrigger id="spaceType">
                  <SelectValue placeholder="Select type" />
              </SelectTrigger>
                <SelectContent>
                {SPACE_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

            {/* Price Input */}
            <div>
              <Label htmlFor="price">Price (per hour)</Label>
              <Input
                id="price"
                name="price"
                type="number" 
                min="0" // Price can be 0 but not negative
                step="0.01" // Allow cents
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 15.50"
                required
              />
          </div>
          </div>

           {/* Opening and Closing Time (Side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openingTime">Opening Time (HH:MM)</Label>
              <Input
                id="openingTime"
                name="openingTime"
                type="time" // Use time type for better semantics/potential picker
                value={formData.openingTime}
                onChange={handleInputChange}
                required
                pattern="([01]\d|2[0-3]):([0-5]\d)" // Pattern for validation hint
              />
            </div>
            <div>
              <Label htmlFor="closingTime">Closing Time (HH:MM)</Label>
              <Input
                 id="closingTime"                 
                 name="closingTime"
                 type="time" // Use time type
                 value={formData.closingTime}
                 onChange={handleInputChange}
                 required
                 pattern="([01]\d|2[0-3]):([0-5]\d)" // Pattern for validation hint
              />
                     </div>
                 </div>

          {/* Availability */}
          <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                id="available" 
                name="available" // Add name attribute
                checked={formData.available} 
                onCheckedChange={handleCheckboxChange} // Use specific handler
                      />
             <Label htmlFor="available" className="cursor-pointer">
                Is Available for Booking?
             </Label>
                    </div>

          {/* Add Image Upload Field */}
          <div>
            <Label htmlFor="imageFile">Space Image</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-[200px] h-auto rounded-lg"
                />
                </div>
              )}
            </div>
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm pt-2">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#2F9FE5] hover:bg-[#2387c9]">
              {isLoading ? "Saving..." : (space ? "Update Space" : "Create Space")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};