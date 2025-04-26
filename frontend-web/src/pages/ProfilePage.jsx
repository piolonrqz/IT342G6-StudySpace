import React, { useState, useRef, useEffect } from "react"; // Import useRef, useEffect
import { useAuth } from "../context/AuthContext";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

// Helper function to get initials (can be moved to a utils file)
const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || '?';
};

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth(); // Add logout
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
  const fileInputRef = useRef(null); // Ref for the hidden file input
  const [imgError, setImgError] = useState(false); // State for current profile pic error

  // Effect to update form data if user object changes after initial load
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || 'USER',
      });
      setImgError(false); // Reset image error on user update
      // Clear preview if user data is refreshed (e.g., after save)
      // setPreviewUrl(null); // Optional: Decide if preview should persist
      // setSelectedFile(null); // Optional: Decide if file selection should persist
    }
  }, [user]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSave = () => {
    // Pass both formData and the selectedFile to the updateUser context function
    updateUser(formData, selectedFile);
    // Optionally clear preview and file state after attempting save
    // setPreviewUrl(null);
    // setSelectedFile(null);
    // fileInputRef.current.value = null; // Clear file input
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
        {/* Main Content - Now full width */}
        <div className="w-full">
          <div className="bg-white p-6 rounded shadow-sm">
            <h2 className="text-xl font-medium mb-6">My details</h2>

            {/* Profile Picture */}
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
                <p className="font-medium">{formData.firstName} {formData.lastName}</p>
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

            {/* Form */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Phone number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  placeholder="(+63) 921 701 1868"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="md:col-span-2 mt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full md:w-auto px-6 py-3 bg-sky-500 text-white rounded font-medium hover:bg-sky-300 transition"
                >
                  Save my details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;