import { useState, useEffect, useCallback } from "react";
import { HomeIcon, CalendarIcon, User, LogOutIcon } from "lucide-react";
import { UserFormModal } from '@/Components/UserFormModal';
import { ConfirmationModal } from "@/Components/ConfirmationModal";
import { UserManagement } from '@/Components/UserManagement';
import { SpaceManagement } from '@/Components/SpaceManagement';
import { SpaceFormModal } from '@/Components/SpaceFormModal';
import { BookingManagement } from '@/Components/BookingManagement'; // Import BookingManagement
import { BookingFormModal } from '@/Components/BookingFormModal'; // Import BookingFormModal
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from "@/hooks/use-toast"; // Import useToast

// StatsCard Component
const StatsCard = ({ title, value }) => {
  return (
    // Changed background to white to sit inside the main content area
    <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-center min-w-[250px] flex-1">
      <div>
        {/* Adjusted text colors/sizes for white background */}
        <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({
  activeItem,
  onItemClick,
  onLogout // Add onLogout prop
}) => {
  return (
    // Removed background, rounded corners, adjusted padding/margins
    <nav className="h-full flex flex-col py-6 px-4"> 
      {/* Use mt-0 for the first button, adjust text/icon colors for light blue background */}
      <button
        onClick={() => onItemClick("user-management")}
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors mb-4 ${ // Added mb-4 for spacing
          activeItem === "user-management"
            ? "bg-[#2F9FE5] text-white" // Active state
            : "hover:bg-[#d0eaf8] text-gray-700" // Inactive state - darker text for contrast
        }`}
      >
        <User className="h-5 w-5" />
        <span className="font-medium">User Management</span>
      </button>
      
      <button
        onClick={() => onItemClick("space-management")}
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors mb-4 ${
          activeItem === "space-management"
            ? "bg-[#2F9FE5] text-white"
            : "hover:bg-[#d0eaf8] text-gray-700"
        }`}
      >
        <HomeIcon className="h-5 w-5" />
        <span>Space Management</span>
      </button>
      
      <button
        onClick={() => onItemClick("booking-management")}
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
          activeItem === "booking-management"
            ? "bg-[#2F9FE5] text-white"
            : "hover:bg-[#d0eaf8] text-gray-700"
        }`}
      >
        <CalendarIcon className="h-5 w-5" />
        <span>Booking Management</span>
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogout} // Call the passed logout function
        // Changed text color to gray-700 and hover background to light blue to match other inactive buttons
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors mt-auto bg-[#2F9FE5] text-white hover:bg-[#2387c9]`} // Use mt-auto to push to bottom
      >
        <LogOutIcon className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

// --- Main AdminPage Component ---
const AdminPage = () => {
  const [activeItem, setActiveItem] = useState("user-management");
  const [users, setUsers] = useState(null);
  const [spaces, setSpaces] = useState(null);
  const [bookings, setBookings] = useState(null); // State for bookings data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout, token } = useAuth(); // Get token for API calls
  const { toast } = useToast(); // Use toast for notifications

  // --- User State ---
  const [isUserConfirmModalOpen, setIsUserConfirmModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // --- Space State ---
  const [isSpaceConfirmModalOpen, setIsSpaceConfirmModalOpen] = useState(false);
  const [spaceToDeleteId, setSpaceToDeleteId] = useState(null);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);

  // --- Booking State ---
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // For Edit modal
  const [editingBooking, setEditingBooking] = useState(null); // Booking being edited
  const [isBookingCancelConfirmModalOpen, setIsBookingCancelConfirmModalOpen] = useState(false); // For Cancel confirmation
  const [bookingToCancelId, setBookingToCancelId] = useState(null); // ID for cancellation
  const [isBookingDeleteConfirmModalOpen, setIsBookingDeleteConfirmModalOpen] = useState(false); // For Delete confirmation
  const [bookingToDeleteId, setBookingToDeleteId] = useState(null); // ID for deletion

  const API_BASE_URL = "http://localhost:8080/api";

  // --- Fetch Functions ---
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/users/getAll`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Try to parse as text first to diagnose JSON issues
      const responseText = await response.text();
      
      let data;
      try {
        // Then parse the text to JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.log("Response that failed to parse:", responseText.substring(0, 200) + "..."); // Log start of response
        throw new Error(`Failed to parse server response as JSON: ${parseError.message}`);
      }
      
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
      setError("Failed to load users. Please try again. " + e.message);
      setUsers([]); // Set to empty array on error to avoid breaking map
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, token]); // Add token dependency

  const fetchSpaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/space/getAll`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Make sure to parse JSON
      setSpaces(data);
    } catch (e) {
      console.error("Failed to fetch spaces:", e);
      setError("Failed to load spaces. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, token]); // Add token dependency

  // Fetch Bookings Function
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/detailed`, {
        headers: { 'Authorization': `Bearer ${token}` } // Add Authorization header
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBookings(data);
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
      setError("Failed to load bookings. Please try again.");
      setBookings([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, token]); // Add token dependency

  // Fetch data based on active item
  useEffect(() => {
    setError(null); // Clear error when switching tabs
    if (activeItem === "user-management") {
      fetchUsers();
    } else if (activeItem === "space-management") {
      fetchSpaces();
    } else if (activeItem === "booking-management") {
      fetchBookings(); // Call fetchBookings
    }
  }, [activeItem, fetchUsers, fetchSpaces, fetchBookings]); // Add fetchBookings dependency

  // --- CRUD Handlers --- User ---

  // Add User
  const handleAddUserClick = () => {
    setEditingUser(null); // Ensure we are adding, not editing
    setIsUserModalOpen(true);
    console.log("Open Add User Modal");
    // Modal component would handle the form and call handleSaveUser
  };

  // Edit User
  const handleEditUserClick = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
     // Modal component would handle the form and call handleSaveUser
  };

  // Delete User
  // Function to open the confirmation modal
  const handleOpenUserDeleteConfirm = (userId) => {
    setUserToDeleteId(userId);    // Store the ID of the user to delete
    setIsUserConfirmModalOpen(true); // Open the confirmation modal
  };

  // Function to actually perform the deletion (called by ConfirmationModal)
  const performDeleteUser = async () => {
    if (!userToDeleteId) return; // Safety check

    console.log("Attempting to delete user:", userToDeleteId);
    // Set loading specifically for the delete action if needed, 
    // or use the general isLoading state. We'll use general for simplicity here.
    setIsLoading(true); 
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/delete/${userToDeleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
          const errorData = await response.text(); 
          throw new Error(`Failed to delete user: ${response.status} - ${errorData}`);
      }
       console.log("User deleted successfully:", userToDeleteId);
      fetchUsers(); // Refresh user list
      setIsUserConfirmModalOpen(false); // Close the confirmation modal on success
      setUserToDeleteId(null); // Clear the stored ID
    } catch (e) {
      console.error("Failed to delete user:", e);
      setError(`Failed to delete user. ${e.message}`);
      // Optionally keep the confirmation modal open on error, or close it
      // setIsConfirmModalOpen(false); 
    } finally {
      setIsLoading(false); // Ensure loading is turned off
    }
  };

   // Save User (Called from Modal - handles both Add and Edit)
   const handleSaveUser = async (userData) => {
     console.log("Saving user:", userData);
     setIsLoading(true);
     setError(null);
     const isEditing = !!editingUser; // Check if we are editing
     const url = isEditing ? `${API_BASE_URL}/users/update/${editingUser.id}` : `${API_BASE_URL}/users/save`;
     const method = isEditing ? 'PUT' : 'POST';

     try {
         let response;
         if (isEditing) {
           // --- Use FormData for editing (PUT) to support file upload in the future ---
           const formData = new FormData();
           // Add userData as a JSON blob
           formData.append('userData', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
           // Append profile picture file if present
           if (userData.profilePictureFile) {
             formData.append('profilePictureFile', userData.profilePictureFile);
           }
           response = await fetch(url, {
             method: method,
             body: formData,
             // Do NOT set Content-Type header; browser will set it for FormData
           });
         } else {
           // --- For add user (POST), keep using JSON ---
           response = await fetch(url, {
             method: method,
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify(userData),
           });
         }

         if (!response.ok) {
             // Try to parse error as JSON, fallback to text
             let errorMessage = `Failed to save user: ${response.status}`;
             try {
               const errorData = await response.json();
               errorMessage += ` - ${errorData.message || errorData.error || 'Unknown error'}`;
             } catch {
               const errorText = await response.text();
               errorMessage += ` - ${errorText}`;
             }
             throw new Error(errorMessage);
         }

         console.log("User saved successfully");
         setIsUserModalOpen(false); // Close modal on success
         setEditingUser(null);
         fetchUsers(); // Refresh list
     } catch (e) {
         console.error("Failed to save user:", e);
         setError(`Failed to save user. ${e.message}`);
         // Keep modal open on error so user can see the issue or retry
     } finally {
         setIsLoading(false);
     }
   };

  // --- CRUD Handlers --- Space ---

  // Add Space
  const handleAddSpaceClick = () => {
    setEditingSpace(null); // Ensure we are adding, not editing
    setIsSpaceModalOpen(true);
    setError(null); // Clear previous errors
    console.log("Open Add Space Modal");
  };

  // Edit Space
  const handleEditSpaceClick = (space) => {
    setEditingSpace(space);
    setIsSpaceModalOpen(true);
    setError(null); // Clear previous errors
  };

  // Open Delete Space Confirmation
  const handleOpenSpaceDeleteConfirm = (spaceId) => {
    setSpaceToDeleteId(spaceId);    // Store the ID of the space to delete
    setIsSpaceConfirmModalOpen(true); // Open the space confirmation modal
    setError(null); // Clear previous errors
  };

  // Perform Delete Space
  const performDeleteSpace = async () => {
    if (!spaceToDeleteId) return; 

    console.log("Attempting to delete space:", spaceToDeleteId);
    setIsLoading(true); 
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/space/delete/${spaceToDeleteId}`, {
        method: 'DELETE',
      });
      
      const responseText = await response.text(); // Read response text regardless of status

      if (!response.ok) {
          // Use specific message from backend if available, otherwise use status
          throw new Error(`Failed to delete space: ${response.status} - ${responseText || 'Unknown error'}`);
      }
       console.log("Space deleted successfully:", spaceToDeleteId, "Response:", responseText);
      fetchSpaces(); // Refresh space list
      setIsSpaceConfirmModalOpen(false); // Close the confirmation modal on success
      setSpaceToDeleteId(null); // Clear the stored ID
    } catch (e) {
      console.error("Failed to delete space:", e);
      setError(`Failed to delete space. ${e.message}`);
      // Optionally keep the confirmation modal open on error
    } finally {
      setIsLoading(false); 
    }
  };

  // Save Space (Add & Edit)
  const handleSaveSpace = async (formDataFromModal) => {
    console.log("Saving space...");
    
    setIsLoading(true);
    setError(null);
    const isEditing = !!editingSpace; // Use editingSpace state to determine Add vs Edit
    const url = isEditing ? `${API_BASE_URL}/space/update/${editingSpace.id}` : `${API_BASE_URL}/space/save`;
    const method = isEditing ? 'PUT' : 'POST';

    let response; // Define response variable outside try block to access in catch

    try {
        
        // --- Log FormData contents (for debugging) ---
        // Note: You can't directly log FormData objects easily.
        // You can iterate through entries if needed:
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        // --- Make the fetch request with the received FormData ---
        response = await fetch(url, { // Assign to the outer response variable
          method: method,
          body: formDataFromModal, // Send the FormData object received from the modal
          // NO 'Content-Type' header - browser sets it automatically for FormData
      });

         // Check response status before parsing JSON
        if (!response.ok) {
          // Read the response body ONCE here
          const errorText = await response.text(); 
          console.error("Error response text:", errorText);
          let errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
          try { // Try parsing as JSON in case backend sends structured errors
            const errorJson = JSON.parse(errorText);
            errorMessage = `Failed to save space: ${response.status} - ${errorJson.message || errorJson.error || errorText}`;
          } catch (parseError) {
            // If JSON parsing fails, use the text content
            errorMessage = `Failed to save space: ${response.status} - ${errorText || response.statusText}`;
          }
         throw new Error(errorMessage);
       }

         // Add handling for existing image when editing
        if (isEditing && editingSpace?.imageFilename && !formDataFromModal.has('imageFile')) {
          // Corrected: Use formDataFromModal here
          // Also check if a *new* file was actually selected before appending this.
          // We only need to tell the backend about the existing image if no *new* image was uploaded.
          formDataFromModal.append('existingImageFilename', editingSpace.imageFilename);
        }


        
        try {
          console.log("Space saved successfully:");
          setIsSpaceModalOpen(false); // Close modal on success
          setEditingSpace(null);
          fetchSpaces(); // Refresh list
        } catch (parseError) {
          // Log the raw response text if JSON parsing fails
          const rawResponse = await response.text();
          console.error("Failed to parse JSON response. Raw response:", rawResponse);
          console.error("JSON Parsing Error:", parseError);
          setError(`Failed to process server response. Please check console for details.`);
        }
    } catch (e) {
        console.error("Failed to save space (network or other error):", e);
        // Attempt to get raw response text even in outer catch if possible
        // This might fail if 'response' is not defined due to an earlier error
        try {
          const rawResponse = await response.text();
          console.error("Raw response text on network/other error:", rawResponse);
        } catch (textError) {
          console.error("Could not get raw response text on error:", textError);
        }
        setError(`Failed to save space. ${e.message}`); // Display the constructed error message
        // Keep modal open on error
    } finally {
        setIsLoading(false);
    }
  };

  // --- CRUD Handlers --- Booking ---

  // Edit Booking (Open Modal)
  const handleEditBookingClick = (booking) => {
    setEditingBooking(booking);
    setIsBookingModalOpen(true);
    setError(null); // Clear previous errors
  };

  // Save Booking (Update Status/Participants)
  const handleSaveBooking = async (updateData) => {
    if (!editingBooking) return;
    console.log("Saving booking update:", updateData);
    setIsLoading(true);
    setError(null);
    const url = `${API_BASE_URL}/bookings/updateAdmin/${editingBooking.id}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add token
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
            throw new Error(`Failed to update booking: ${response.status} - ${errorData.message || errorData.error || 'Unknown error'}`);
        }

        const savedBooking = await response.json();
        console.log("Booking updated successfully:", savedBooking);
        toast({ title: "Booking Updated", description: `Booking #${savedBooking.id} has been updated.` });
        setIsBookingModalOpen(false);
        setEditingBooking(null);
        fetchBookings(); // Refresh list
    } catch (e) {
        console.error("Failed to save booking update:", e);
        setError(`Failed to update booking. ${e.message}`);
        // Keep modal open on error
    } finally {
        setIsLoading(false);
    }
  };

  // Open Cancel Confirmation
  const handleOpenBookingCancelConfirm = (bookingId) => {
    setBookingToCancelId(bookingId);
    setIsBookingCancelConfirmModalOpen(true);
    setError(null);
  };

  // Perform Cancel Booking (Soft Delete)
  const performCancelBooking = async (reason) => {
    if (!bookingToCancelId) return;
    console.log("Attempting to cancel booking:", bookingToCancelId, "Reason:", reason);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingToCancelId}/cancel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add token
        },
        body: JSON.stringify({ reason }) // Send reason in body
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          throw new Error(`Failed to cancel booking: ${response.status} - ${errorData.message || errorData.error || 'Unknown error'}`);
      }
       console.log("Booking cancelled successfully:", bookingToCancelId);
       toast({ title: "Booking Cancelled", description: `Booking #${bookingToCancelId} has been cancelled.` });
       fetchBookings(); // Refresh list
       setIsBookingCancelConfirmModalOpen(false);
       setBookingToCancelId(null);
    } catch (e) {
      console.error("Failed to cancel booking:", e);
      setError(`Failed to cancel booking. ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Open Delete Confirmation
  const handleOpenBookingDeleteConfirm = (bookingId) => {
    setBookingToDeleteId(bookingId);
    setIsBookingDeleteConfirmModalOpen(true);
    setError(null);
  };

  // Perform Delete Booking (Hard Delete)
  const performDeleteBooking = async () => {
    if (!bookingToDeleteId) return;
    console.log("Attempting to delete booking:", bookingToDeleteId);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/delete/${bookingToDeleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` } // Add token
      });

      const responseText = await response.text(); // Read response text

      if (!response.ok) {
          throw new Error(`Failed to delete booking: ${response.status} - ${responseText || 'Unknown error'}`);
      }
       console.log("Booking deleted successfully:", bookingToDeleteId, "Response:", responseText);
       toast({ title: "Booking Deleted", description: `Booking #${bookingToDeleteId} has been permanently deleted.` });
       fetchBookings(); // Refresh list
       setIsBookingDeleteConfirmModalOpen(false);
       setBookingToDeleteId(null);
    } catch (e) {
      console.error("Failed to delete booking:", e);
      setError(`Failed to delete booking. ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Logic ---
  const renderContent = () => {
    // Add loading state for bookings
    if (isLoading && activeItem === 'booking-management' && !bookings) {
      return <div className="text-center py-10">Loading Bookings...</div>;
    }
    // ... existing loading states for user/space ...

     if (error && activeItem !== 'user-management' && activeItem !== 'space-management') { // Show general error if not handled by modals
         return <div className="text-center py-10 text-red-600">Error: {error}</div>;
     }
     // General loading indicator (e.g., during delete/cancel)
     if (isLoading && !isUserModalOpen && !isSpaceModalOpen && !isBookingModalOpen) {
      return <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F9FE5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing...</p>
      </div>;
     }

    switch (activeItem) {
      case "user-management":
        return <UserManagement
          users={users}
          onEdit={handleEditUserClick}
          onDelete={handleOpenUserDeleteConfirm}
          onAdd={handleAddUserClick}
        />;
      case "space-management":
        return <SpaceManagement
          spaces={spaces}
          onEdit={handleEditSpaceClick}
          onDelete={handleOpenSpaceDeleteConfirm}
          onAdd={handleAddSpaceClick}
        />;
      case "booking-management":
        return <BookingManagement // Render BookingManagement
          bookings={bookings}
          onEdit={handleEditBookingClick}
          onCancel={handleOpenBookingCancelConfirm} // Pass cancel handler
          onDelete={handleOpenBookingDeleteConfirm} // Pass delete handler
        />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-[#EBF6FC] h-screen sticky top-0">
        <Sidebar activeItem={activeItem} onItemClick={setActiveItem} onLogout={logout} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {/* Use the blue logo background */}
            <div className="w-12 h-12 rounded-lg bg-[#2F9FE5] flex items-center justify-center text-white"> 
              <img src="/images/logoW.png" alt="StudySpace" className="h-8" />
            </div>
            {/* Keep text blue */}
            <h1 className="text-2xl font-semibold text-[#2F9FE5]">StudySpace Admin</h1> 
          </div>
          {/* End Header */}

          {/* Stats Cards - Now have white background */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard title="Total Users" value={isLoading ? '...' : (users ? users.length : '0')} />
            <StatsCard title="Active Spaces" value={isLoading ? '...' : (spaces ? spaces.length : '0')} />
            <StatsCard title="Total Bookings" value={isLoading ? '...' : (bookings ? bookings.length : '0')} /> {/* Update value */}
          </div>
          {/* End Stats Cards */}

          {/* Dynamic Content Area */}
          {renderContent()}
          {/* End Dynamic Content Area */}

          {/* --- Modals --- */}

          {/* User Modals */}
          {isUserModalOpen && (
            <UserFormModal
              isOpen={isUserModalOpen}
              onClose={() => {
                setIsUserModalOpen(false);
                setEditingUser(null);
                setError(null);
              }}
              onSave={handleSaveUser}
              user={editingUser}
              isLoading={isLoading}
              error={error} // Pass error state specific to the form if needed
            />
          )}

          {/* User Delete Confirmation Modal */}
          {isUserConfirmModalOpen && ( // Use renamed state
             <ConfirmationModal
                 isOpen={isUserConfirmModalOpen} // Use renamed state
                 onClose={() => {
                     setIsUserConfirmModalOpen(false); // Use renamed state setter
                     setUserToDeleteId(null);
                     setError(null); // Clear error on close
                 }}
                 onConfirm={performDeleteUser} 
                 title="Delete User?"
                 description={`Are you sure you want to delete user ID: ${userToDeleteId}? This action cannot be undone.`}
                 confirmText="Delete"
                 isLoading={isLoading}
             />
          )}

          {/* Space Modals */}
          {isSpaceModalOpen && (
            <SpaceFormModal
              isOpen={isSpaceModalOpen}
              onClose={() => {
                setIsSpaceModalOpen(false);
                setEditingSpace(null);
                setError(null); // Clear error on close
              }}
              onSave={handleSaveSpace}
              space={editingSpace}
              isLoading={isLoading}
              error={error} 
            />
          )}

          {/* Space Delete Confirmation Modal */}
           {isSpaceConfirmModalOpen && (
             <ConfirmationModal
                 isOpen={isSpaceConfirmModalOpen}
                 onClose={() => {
                     setIsSpaceConfirmModalOpen(false);
                     setSpaceToDeleteId(null);
                     setError(null); // Clear error on close
                 }}
                 onConfirm={performDeleteSpace} // Pass the space delete function
                 title="Delete Space?" // Updated title
                 description={`Are you sure you want to delete space ID: ${spaceToDeleteId}? This also deletes associated bookings and cannot be undone.`} // Updated description
                 confirmText="Delete"
                 isLoading={isLoading} 
             />
          )}

          {/* Booking Edit Modal */}
          {isBookingModalOpen && (
            <BookingFormModal
              isOpen={isBookingModalOpen}
              onClose={() => {
                setIsBookingModalOpen(false);
                setEditingBooking(null);
                setError(null); // Clear error on close
              }}
              onSave={handleSaveBooking}
              booking={editingBooking}
              isLoading={isLoading}
              error={error}
            />
          )}

          {/* Booking Cancel Confirmation Modal */}
           {isBookingCancelConfirmModalOpen && (
             <ConfirmationModal
                 isOpen={isBookingCancelConfirmModalOpen}
                 onClose={() => {
                     setIsBookingCancelConfirmModalOpen(false);
                     setBookingToCancelId(null);
                     setError(null);
                 }}
                 onConfirm={performCancelBooking} // Pass the booking cancel function
                 title="Cancel Booking?"
                 description={`Are you sure you want to cancel booking ID: ${bookingToCancelId}? This will mark the booking as CANCELLED.`}
                 confirmText="Confirm Cancellation"
                 showReasonField={true} // Enable reason field
                 reasonLabel="Cancellation Reason (Optional)"
                 isLoading={isLoading}
             />
          )}

          {/* Booking Delete Confirmation Modal */}
           {isBookingDeleteConfirmModalOpen && (
             <ConfirmationModal
                 isOpen={isBookingDeleteConfirmModalOpen}
                 onClose={() => {
                     setIsBookingDeleteConfirmModalOpen(false);
                     setBookingToDeleteId(null);
                     setError(null);
                 }}
                 onConfirm={performDeleteBooking} // Pass the booking delete function
                 title="Delete Booking Permanently?"
                 description={`Are you sure you want to permanently delete booking ID: ${bookingToDeleteId}? This action cannot be undone.`}
                 confirmText="Delete Permanently"
                 isLoading={isLoading}
             />
          )}

      </div> {/* End Main Content Area */}
    </div> /* End Main Flex Container */
  );
};

export default AdminPage;
