import React, { useState, useRef, useEffect } from "react"; // Import useRef, useEffect
import { useAuth } from "../context/AuthContext";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react"; // Import Check and X icons from lucide-react

// Helper function to get initials (can be moved to a utils file)
const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || '?';
};

const ProfilePage = () => {
  const { user, updateUser, changePassword, setPassword } = useAuth(); // Add setPassword from context
  const { toast } = useToast(); // Initialize toast
  
  // New state for display name that doesn't change while typing
  const [displayName, setDisplayName] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  
  const [formData, setFormData] = useState({
    // Initialize with user data or defaults
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    // Add other fields expected by UserUpdateDTO if needed, like role
    role: user?.role || 'USER', // Assuming role exists and defaults to USER
    // Password field is generally not pre-filled or updated this way for security
    // password: "", // Remove password prefill
  });
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file object
  const [previewUrl, setPreviewUrl] = useState(null); // State for the image preview URL
  const [isCheckingEmail, setIsCheckingEmail] = useState(false); // State to track email validation
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const [phoneError, setPhoneError] = useState(""); // State for phone number validation error
  const [firstNameError, setFirstNameError] = useState(""); // State for first name validation error
  const [lastNameError, setLastNameError] = useState(""); // State for last name validation error
  const fileInputRef = useRef(null); // Ref for the hidden file input
  const [imgError, setImgError] = useState(false); // State for current profile pic error

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Password validation helper functions
  const hasMinLength = (password) => password && password.length >= 8;
  const hasNumber = (password) => password && /\d/.test(password);
  const passwordsMatch = () => 
    passwordData.newPassword && 
    passwordData.confirmNewPassword && 
    passwordData.newPassword === passwordData.confirmNewPassword;
  
  // Effect to update form data if user object changes after initial load
  useEffect(() => {
    if (user) {
      // Update both form data and display name when user object changes
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || 'USER',
      });
      
      setDisplayName({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
      
      setImgError(false); // Reset image error on user update
      // Clear preview if user data is refreshed (e.g., after save)
      // setPreviewUrl(null); // Optional: Decide if preview should persist
      // setSelectedFile(null); // Optional: Decide if file selection should persist
    }
  }, [user]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // Only allow digits for phone number
      const digits = value.replace(/\D/g, '');
      // Limit to 10 digits
      const formattedPhone = digits.slice(0, 10);
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedPhone,
      }));
      // Real-time phone number validation
      if (formattedPhone.length > 0 && formattedPhone.length !== 10) {
        setPhoneError('Phone number must be exactly 10 digits.');
      } else {
        // Clear error if valid (10 digits) or empty
        setPhoneError("");
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      
      // Clear email error when email field is edited
      if (name === 'email') {
        setEmailError("");
      }
      // Clear name errors when name fields are edited
      if (name === 'firstName') {
        setFirstNameError("");
      }
      if (name === 'lastName') {
        setLastNameError("");
      }
    }
  };
  
  // Function to validate phone number
  const validatePhoneNumber = (phoneNumber) => {
    // Check if the phone number has exactly 10 digits
    return phoneNumber && phoneNumber.length === 10;
  };
  
  // Handle password input change
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear specific error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
    if (name === 'newPassword' || name === 'confirmNewPassword') {
        if (passwordErrors.match) {
            setPasswordErrors((prevErrors) => ({
                ...prevErrors,
                match: null,
            }));
        }
    }
    if (name === 'newPassword') {
      setShowPasswordRequirements(true);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImgError(false); // Reset error state when new file is selected
    }
  };

  // Trigger hidden file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Check if email is already in use (but ignore the user's current email)
  const checkEmailAvailability = async (email) => {
    if (email === user.email) return true; // Skip check if email hasn't changed
    
    setIsCheckingEmail(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/check-email?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Failed to check email availability');
      
      const isUnique = await response.json(); // Backend returns true if unique, false if exists
      return isUnique; // Return true if email is available (unique), false if it exists
    } catch (error) {
      console.error("Error checking email:", error);
      // Decide how to handle API errors. Returning false might prevent saving.
      // Maybe show a specific error toast here? For now, assume not available on error.
      toast({
        title: "Email Check Failed",
        description: "Could not verify email availability. Please try again.",
        variant: "destructive",
      });
      return false; // Assume email is not available if there's an error
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSave = async () => {
    // Reset errors
    setEmailError("");
    setPhoneError(""); // Reset just in case, though should be handled by input change
    setFirstNameError(""); // Reset first name error
    setLastNameError(""); // Reset last name error
    
    let hasErrors = false;
    
    // Validate names
    const nameRegex = /^[A-Za-z\s'-]+$/; // Regex from RegisterForm
    if (!nameRegex.test(formData.firstName)) {
      setFirstNameError('First name can only contain letters, spaces, hyphens, and apostrophes.');
      hasErrors = true;
    }
    if (!nameRegex.test(formData.lastName)) {
      setLastNameError('Last name can only contain letters, spaces, hyphens, and apostrophes.');
      hasErrors = true;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError('Please enter a valid email address.');
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      hasErrors = true;
    }
    
    // Validate phone number
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      toast({
        title: "Invalid Phone Number",
        variant: "destructive",
      });
      hasErrors = true;
    }
    
    if (hasErrors) return;
    
    try {
      // Check if email is available if it has changed
      if (formData.email !== user.email) {
        const isEmailAvailable = await checkEmailAvailability(formData.email);
        // isEmailAvailable is true if unique, false if exists
        if (!isEmailAvailable) { // If email is NOT available (already exists)
          setEmailError('Email already exists. Please use a different one.');
          toast({
            title: "Email Already Exists",
            description: "This email is already in use. Please use a different one.",
            variant: "destructive",
          });
          return; // Stop the save process
        }
      }
      
      // Pass both formData and the selectedFile to the updateUser context function
      await updateUser(formData, selectedFile);
      
      // Update the display name only after successful save
      setDisplayName({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      toast({ // Show success toast
        title: "Success",
        description: "Your details have been updated successfully.",
      });
      // Optionally clear preview and file state after successful save
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Clear file input
      }
    } catch (error) {
      console.error("Failed to save details:", error);
      // Display specific error from backend if available (e.g., from updateUser context)
      const errorMessage = error.response?.data?.error || error.message || "Failed to update details. Please try again.";
      setEmailError(errorMessage); // Show error near the email field or a general form error
      toast({ // Show error toast
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async () => {
    const errors = {};
    const isSettingPassword = !user.hasPassword; // Determine if setting or changing

    // Validate current password only if changing
    if (!isSettingPassword && !passwordData.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    // Validate new password
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required.";
    } else {
      // Basic regex for password complexity (example: min 8 chars, 1 letter, 1 number)
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        errors.newPassword = "Password must be at least 8 characters long and include at least one letter and one number.";
      }
    }

    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.match = "New passwords do not match.";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        if (isSettingPassword) {
          // Call setPassword if user doesn't have a password
          await setPassword({ newPassword: passwordData.newPassword });
          toast({
            title: "Success",
            description: "Password set successfully.",
          });
        } else {
          // Call changePassword if user already has a password
          await changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          });
          toast({
            title: "Success",
            description: "Password changed successfully.",
          });
        }

        // Clear password fields after successful operation
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setPasswordErrors({});
        setShowPasswordRequirements(false); // Hide requirements again

      } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || `Failed to ${isSettingPassword ? 'set' : 'change'} password. Please try again.`;
        setPasswordErrors({ api: errorMessage }); // Set a general API error
        toast({
          title: "Incorrect current password",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      // Optionally toast validation errors
      const firstError = Object.values(errors)[0];
      toast({
        title: "Validation Error",
        description: firstError,
        variant: "destructive",
      });
    }
  };

  // Determine the image source
  const getProfileImageSource = () => {
    if (previewUrl) {
      return previewUrl; // Show preview if available
    }
    if (user?.profilePictureFilename && !imgError) {
      // Use Firebase URL directly
      return user.profilePictureFilename;
    }
    return null; // No image source, fallback to initials
  };

  const profileImageSource = getProfileImageSource();

  return (
    <div className="min-h-screen bg-gray-50 font-poppins flex flex-col">
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* User Details Section */}
        <div className="bg-white p-6 rounded shadow-sm mb-8"> {/* Added mb-8 */}
          <h2 className="text-xl font-medium mb-6">My details</h2>
          {/* Profile Picture and Upload */}
          <div className="flex items-center mb-8">
            <div className="relative">
              {/* Increase size from w-16 h-16 to w-24 h-24 */}
              {/* Increase font size for initials from text-xl to text-3xl */}
              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-700 text-3xl font-medium">
                {profileImageSource ? (
                  <img
                    src={profileImageSource}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => {
                      if (profileImageSource && !previewUrl) { // Only set error for non-preview images
                        setImgError(true);
                      }
                    }}
                  />
                ) : (
                  // Fallback to initials
                  getInitials(user?.firstName, user?.lastName)
                )}
              </div>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg" // Specify acceptable file types
                style={{ display: 'none' }}
              />
            </div>
            <div className="ml-4">
              <p className="font-medium">{displayName.firstName} {displayName.lastName}</p>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={handleUploadClick} // Trigger file input
                  className="text-sm border border-gray-300 rounded-full px-4 py-1 hover:bg-gray-50"
                >
                  Upload new picture
                </button>
                {/* Delete button removed as requested */}
              </div>
            </div>
          </div>

          {/* User Details Form */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full p-3 border ${firstNameError ? 'border-red-500' : 'border-gray-300'} rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none`}
              />
              {firstNameError && <p className="text-red-500 text-xs mt-1">{firstNameError}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full p-3 border ${lastNameError ? 'border-red-500' : 'border-gray-300'} rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none`}
              />
              {lastNameError && <p className="text-red-500 text-xs mt-1">{lastNameError}</p>}
            </div>

            {/* Phone Number with Prefix */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Phone number</label>
              <div className={`flex rounded-[10px] overflow-hidden border ${phoneError ? 'border-red-500' : 'border-gray-300'}`}> {/* Apply red border on error */}
                <div className="bg-gray-100 py-3 px-4 text-gray-600 border-r border-gray-300">+63</div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`flex-grow p-3 border-0 focus:ring-1 focus:ring-gray-300 focus:outline-none`}
                  placeholder="9xxxxxxxxx"
                  maxLength="10" // Keep maxLength for user experience
                />
              </div>
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              <p className="text-gray-500 text-xs mt-1">Enter 10 digits only, no spaces or special characters</p>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none`}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Save Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={isCheckingEmail}
                className={`w-full md:w-auto px-6 py-3 ${isCheckingEmail ? 'bg-gray-400' : 'bg-sky-500 hover:bg-sky-300'} text-white rounded font-medium transition`}
              >
                {isCheckingEmail ? 'Checking...' : 'Save my details'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white p-6 rounded shadow-sm">
          {/* Conditionally render title */}
          <h2 className="text-xl font-medium mb-6">
            {user?.hasPassword ? "Change password" : "Set password"}
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Password - Conditionally render */}
            {user?.hasPassword && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">Current password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className={`w-full p-3 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none`}
                />
                {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>}
              </div>
            )}
            {/* Spacer div - Conditionally render only if current password is shown */}
            {user?.hasPassword && <div></div>}

            {/* New Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">New password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className={`w-full p-3 border ${passwordErrors.newPassword || passwordErrors.match ? 'border-red-500' : 'border-gray-300'} rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none`}
              />
              
              {/* Only show password requirements when user types something */}
              {passwordData.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center">
                    {hasMinLength(passwordData.newPassword) ? (
                      <Check className="text-green-500 h-4 w-4 mr-2" />
                    ) : (
                      <X className="text-red-500 h-4 w-4 mr-2" />
                    )}
                    <span className="text-xs text-gray-600">Password must be at least 8 characters long</span>
                  </div>
                  <div className="flex items-center">
                    {hasNumber(passwordData.newPassword) ? (
                      <Check className="text-green-500 h-4 w-4 mr-2" />
                    ) : (
                      <X className="text-red-500 h-4 w-4 mr-2" />
                    )}
                    <span className="text-xs text-gray-600">At least one number</span>
                  </div>
                </div>
              )}
              
              {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Confirm new password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordInputChange}
                className={`w-full p-3 border ${passwordErrors.match ? 'border-red-500' : 'border-gray-300'} rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none`}
              />
              
              {/* Real-time password matching validation */}
              {(passwordData.newPassword && passwordData.confirmNewPassword) && (
                <div className="mt-2">
                  <div className="flex items-center">
                    {passwordsMatch() ? (
                      <Check className="text-green-500 h-4 w-4 mr-2" />
                    ) : (
                      <X className="text-red-500 h-4 w-4 mr-2" />
                    )}
                    <span className="text-xs text-gray-600">Passwords {passwordsMatch() ? 'match' : 'do not match'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* API Error Display */}
            {passwordErrors.api && (
                <div className="md:col-span-2 text-red-500 text-sm">
                    {passwordErrors.api}
                </div>
            )}

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="button"
                onClick={handlePasswordSubmit} // Use the updated handler
                className="w-full md:w-auto px-6 py-3 bg-sky-500 text-white rounded font-medium hover:bg-sky-300 transition"
              >
                {/* Conditionally render button text */}
                {user?.hasPassword ? "Change password" : "Set password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;