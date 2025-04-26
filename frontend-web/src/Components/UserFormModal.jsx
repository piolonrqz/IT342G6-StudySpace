import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Import DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UserFormModal = ({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "USER",
    password: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();

  // Helper to get profile image source (unified with ProfilePage)
  const getProfileImageSource = (profilePictureFilename) => {
    if (!profilePictureFilename) return null;
    if (/^https?:\/\//i.test(profilePictureFilename)) return profilePictureFilename;
    return `/api/users/profile-picture/${profilePictureFilename}`;
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "USER",
        password: "",
      });
      // Set preview to existing profile picture if available
      if (user.profilePictureFilename) {
        setPreviewUrl(getProfileImageSource(user.profilePictureFilename));
      } else {
        setPreviewUrl(null);
      }
      setProfilePictureFile(null);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "USER",
        password: "",
      });
      setPreviewUrl(null);
      setProfilePictureFile(null);
    }
  }, [user]);

  // Helper for initials
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || '?';
  };

  // Handle file input change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(user && user.profilePictureFilename ? getProfileImageSource(user.profilePictureFilename) : null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass profilePictureFile along with formData
    onSave({ ...formData, profilePictureFile });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update the user's details below." : "Enter the details for the new user."}
          </DialogDescription>
        </DialogHeader>

        {/* Profile Picture Preview and Upload */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden text-sky-700 font-bold text-2xl mb-2">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.onerror = null; e.target.src = ''; }}
              />
            ) : (
              getInitials(formData.firstName, formData.lastName)
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {profilePictureFile ? "Change Profile Picture" : "Upload Profile Picture"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Password {!user && "(Required)"}</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!user}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#2F9FE5] hover:bg-[#2387c9]">
              {isLoading ? "Saving..." : "Save User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};