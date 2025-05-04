import { useEffect, useState, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Check, X } from "lucide-react"; // Import Check and X icons

export const UserFormModal = ({
  isOpen,
  onClose,
  onSave,
  user, // The user object being edited, null if creating
  isLoading,
  // error prop might be less needed now with inline validation, but keep for general API errors
}) => {
  const { toast } = useToast(); // Initialize toast
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "USER",
    password: "", // Keep password field for create/update
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();

  // Validation states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Single state for password errors
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Password validation helpers (similar to ProfilePage)
  const hasMinLength = (password) => password && password.length >= 8;
  const hasLetter = (password) => password && /[A-Za-z]/.test(password); // Added letter check
  const hasNumber = (password) => password && /\d/.test(password);

  // Helper to get profile image source
  const getProfileImageSource = (profilePictureFilename) => {
    if (!profilePictureFilename) return null;
    if (/^https?:\/\//i.test(profilePictureFilename)) return profilePictureFilename;
    return `/api/users/profile-picture/${profilePictureFilename}`;
  };

  // Effect to initialize form data and reset states when modal opens/user changes
  useEffect(() => {
    if (isOpen) { // Reset state only when modal becomes visible or user changes
      if (user) {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          // Ensure phone number is just the 10 digits if it includes +63
          phoneNumber: user.phoneNumber ? user.phoneNumber.replace('+63', '') : "",
          role: user.role || "USER",
          password: "", // Always clear password on edit
        });
        setPreviewUrl(user.profilePictureFilename ? getProfileImageSource(user.profilePictureFilename) : null);
      } else {
        // Reset for new user
        setFormData({
          firstName: "", lastName: "", email: "", phoneNumber: "", role: "USER", password: "",
        });
        setPreviewUrl(null);
      }
      // Reset errors and other states
      setProfilePictureFile(null);
      setFirstNameError("");
      setLastNameError("");
      setEmailError("");
      setPhoneError("");
      setPasswordError("");
      setIsCheckingEmail(false);
      setShowPasswordRequirements(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Clear file input visually
      }
    }
  }, [isOpen, user]); // Rerun effect if isOpen or user changes

  // Helper for initials
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || '?';
  };

  // Handle input changes and clear errors
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      const digits = value.replace(/\D/g, '');
      const formattedPhone = digits.slice(0, 10);
      setFormData((prevData) => ({ ...prevData, [name]: formattedPhone }));
      if (formattedPhone.length > 0 && formattedPhone.length !== 10) {
        setPhoneError('Phone number must be exactly 10 digits.');
      } else {
        setPhoneError(""); // Clear error if valid or empty
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      // Clear errors on edit
      if (name === 'firstName') setFirstNameError("");
      if (name === 'lastName') setLastNameError("");
      if (name === 'email') setEmailError("");
      if (name === 'password') {
          setPasswordError("");
          setShowPasswordRequirements(value.length > 0); // Show requirements only if typing
      }
    }
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

  // Check email availability (similar to ProfilePage)
  const checkEmailAvailability = async (email) => {
    // Skip check if email hasn't changed from the original user's email (only in edit mode)
    if (user && email === user.email) return true;

    setIsCheckingEmail(true);
    setEmailError(""); // Clear previous email errors
    try {
      // Use the same endpoint as ProfilePage
      const response = await fetch(`https://it342g6-studyspace.onrender.com/api/users/check-email?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        // Try to get error message from backend response
        let errorMsg = 'Failed to check email availability';
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
            // Ignore if response is not JSON
        }
        throw new Error(errorMsg);
      }
      const isUnique = await response.json(); // true if unique, false if exists
      if (!isUnique) {
        setEmailError('Email already exists. Please use a different one.');
        return false; // Email is not available
      }
      return true; // Email is available
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailError(error.message || "Could not verify email availability.");
      toast({
        title: "Email Check Failed",
        description: error.message || "Could not verify email availability. Please try again.",
        variant: "destructive",
      });
      return false; // Assume not available on error
    } finally {
      setIsCheckingEmail(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset errors before validation
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");

    let hasErrors = false;

    // --- Validation ---
    // Names
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!formData.firstName || !nameRegex.test(formData.firstName)) {
      setFirstNameError('First name is required and can only contain letters, spaces, hyphens, apostrophes.');
      hasErrors = true;
    }
    if (!formData.lastName || !nameRegex.test(formData.lastName)) {
      setLastNameError('Last name is required and can only contain letters, spaces, hyphens, apostrophes.');
      hasErrors = true;
    }

    // Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setEmailError('Please enter a valid email address.');
      hasErrors = true;
    }

    // Phone Number
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      hasErrors = true;
    }

    // Password (Required for new user, or if field is not empty for existing user)
    const passwordRequired = !user || (user && formData.password);
    if (passwordRequired) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // Min 8, letter, number
        if (!formData.password) {
            setPasswordError('Password is required.');
            hasErrors = true;
        } else if (!passwordRegex.test(formData.password)) {
            setPasswordError('Password must be at least 8 characters, with one letter and one number.');
            hasErrors = true;
        }
    }
    // --- End Validation ---

    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return; // Stop submission if basic validation fails
    }

    // --- Async Email Check ---
    // Check email availability only if format is valid and it changed or it's a new user
    if (emailRegex.test(formData.email) && (!user || formData.email !== user.email)) {
        const isEmailAvailable = await checkEmailAvailability(formData.email);
        if (!isEmailAvailable) {
            // Error state and toast are handled within checkEmailAvailability
            return; // Stop submission if email check fails
        }
    }

    // If all validations pass, call the onSave prop
    // Save only the digits entered by the user for the phone number
    const saveData = {
        ...formData,
        profilePictureFile // Pass the file object
    };
    // Remove password from saveData if it's empty (meaning user didn't want to change it during edit)
    if (user && !formData.password) {
        delete saveData.password;
    }

    onSave(saveData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]"> {/* Adjusted width */}
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
              <Label htmlFor="firstName">First Name</Label> {/* Added htmlFor */}
              <Input
                id="firstName" // Added id
                name="firstName" // Added name
                value={formData.firstName}
                onChange={handleInputChange}
                className={firstNameError ? 'border-red-500' : ''}
                // Removed required attribute, handled in handleSubmit
              />
              {firstNameError && <p className="text-red-500 text-xs mt-1">{firstNameError}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label> {/* Added htmlFor */}
              <Input
                id="lastName" // Added id
                name="lastName" // Added name
                value={formData.lastName}
                onChange={handleInputChange}
                className={lastNameError ? 'border-red-500' : ''}
                // Removed required attribute
              />
              {lastNameError && <p className="text-red-500 text-xs mt-1">{lastNameError}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label> {/* Added htmlFor */}
            <Input
              id="email" // Added id
              name="email" // Added name
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={emailError ? 'border-red-500' : ''}
              // Removed required attribute
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label> {/* Added htmlFor */}
            {/* Phone Number with Prefix - Fixed border edges */}
            <div className={`flex items-center overflow-hidden rounded-md border ${phoneError ? 'border-red-500' : 'border-input'} focus-within:ring-0 focus-within:border-1 focus-within:border-ring`}>
              <span className="bg-muted py-2 px-3 text-muted-foreground border-r border-input">
                +63
              </span>
              <Input
                id="phoneNumber" // Added id
                name="phoneNumber" // Added name
                type="tel" // Use tel type
                value={formData.phoneNumber}
                onChange={handleInputChange}
                // Remove focus styles from inner input to prevent double borders
                className="flex-1 border-0 rounded-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-9 px-3 py-2 text-sm"
                placeholder="9xxxxxxxxx"
                maxLength="10"
                // Removed required attribute
              />
            </div>
            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
            {!phoneError && <p className="text-gray-500 text-xs mt-1">Enter 10 digits only.</p>} {/* Helper text */}
          </div>

          <div>
            <Label htmlFor="role">Role</Label> {/* Added htmlFor */}
            <Select
              name="role" // Added name
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
            {/* Adjusted label based on context */}
            <Label htmlFor="password">Password {user && formData.password ? "(Leave blank to keep current)" : !user ? "(Required)" : ""}</Label> {/* Added htmlFor */}
            <Input
              id="password" // Added id
              name="password" // Added name
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={passwordError ? 'border-red-500' : ''}
              // Removed required={!user} attribute
            />
            {/* Password requirements display */}
            {showPasswordRequirements && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center">
                    {hasMinLength(formData.password) ? (
                      <Check className="text-green-500 h-4 w-4 mr-2" />
                    ) : (
                      <X className="text-red-500 h-4 w-4 mr-2" />
                    )}
                    <span className="text-xs text-gray-600">At least 8 characters</span>
                  </div>
                   <div className="flex items-center">
                    {hasLetter(formData.password) ? (
                      <Check className="text-green-500 h-4 w-4 mr-2" />
                    ) : (
                      <X className="text-red-500 h-4 w-4 mr-2" />
                    )}
                    <span className="text-xs text-gray-600">At least one letter</span>
                  </div>
                  <div className="flex items-center">
                    {hasNumber(formData.password) ? (
                      <Check className="text-green-500 h-4 w-4 mr-2" />
                    ) : (
                      <X className="text-red-500 h-4 w-4 mr-2" />
                    )}
                    <span className="text-xs text-gray-600">At least one number</span>
                  </div>
                </div>
              )}
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          {/* Keep general error display for API errors passed via props if needed */}
          {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

          <div className="flex justify-end gap-2 pt-4"> {/* Added padding top */}
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading || isCheckingEmail}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isCheckingEmail} className="bg-[#2F9FE5] hover:bg-[#2387c9]">
              {isLoading ? "Saving..." : isCheckingEmail ? "Checking Email..." : "Save User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};