import { useState, useEffect, useCallback } from "react";
import { HomeIcon, CalendarIcon, User } from "lucide-react";
import { UserFormModal } from '@/Components/UserFormModal';
import { ConfirmationModal } from "@/Components/ConfirmationModal"; 
import { UserManagement } from '@/Components/UserManagement';
import { SpaceManagement } from '@/Components/SpaceManagement'; 
import { SpaceFormModal } from '@/Components/SpaceFormModal';


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
  onItemClick
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
    </nav>
  );
};



// --- Main AdminPage Component ---
const AdminPage = () => {
  const [activeItem, setActiveItem] = useState("user-management");
  const [users, setUsers] = useState(null); // State for users data
  const [spaces, setSpaces] = useState(null); // State for spaces data
  const [bookings, setBookings] = useState(null); // State for bookings data (TODO)
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // User Delete Confirmation State
  const [isUserConfirmModalOpen, setIsUserConfirmModalOpen] = useState(false); // State for delete confirmation modal
  const [userToDeleteId, setUserToDeleteId] = useState(null); // State to store the ID of the user to be deleted

  // User Add/Edit Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // State for user modal
  const [editingUser, setEditingUser] = useState(null); // State for user being edited
  
   // Space Delete Confirmation State
   const [isSpaceConfirmModalOpen, setIsSpaceConfirmModalOpen] = useState(false); // New state for space delete modal
   const [spaceToDeleteId, setSpaceToDeleteId] = useState(null); // New state for space ID to delete

   // Space Add/Edit Modal State
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false); // New state for space modal
  const [editingSpace, setEditingSpace] = useState(null); // New state for space being edited

  const API_BASE_URL = "http://localhost:8080/api"; // Adjust if your API URL is different

  // Fetch Users Function
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/getAll`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
      setError("Failed to load users. Please try again.");
      setUsers([]); // Set to empty array on error to avoid breaking map
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]); // Dependency array includes API_BASE_URL

  // Fetch spaces function
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
  }, [API_BASE_URL]);

  // Fetch data based on active item
  useEffect(() => {
    if (activeItem === "user-management") {
      fetchUsers();
    } else if (activeItem === "space-management") {
      fetchSpaces();
    } else if (activeItem === "booking-management") {
      // TODO: Fetch bookings -> Similar pattern to fetchUsers
       console.log("Fetching Bookings (TODO)");
       setBookings([]); // Placeholder
    }
  }, [activeItem, fetchUsers, fetchSpaces]); // Rerun when activeItem or fetchUsers changes


  // --- CRUD Handlers --- User

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
     console.log("Open Edit User Modal for:", user);
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
         const response = await fetch(url, {
             method: method,
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify(userData),
         });

         if (!response.ok) {
             const errorData = await response.json(); // Assuming backend returns JSON errors
              throw new Error(`Failed to save user: ${response.status} - ${errorData.message || 'Unknown error'}`);
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

   // --- SPACE CRUD Handlers ---

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
    console.log("Open Edit Space Modal for:", space);
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
    
    for (let [key, value] of formDataFromModal.entries()) {
      console.log(`${key}:`, value);
    }
    setIsLoading(true);
    setError(null);
    const isEditing = !!editingSpace; // Use editingSpace state to determine Add vs Edit
    const url = isEditing ? `${API_BASE_URL}/space/update/${editingSpace.id}` : `${API_BASE_URL}/space/save`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        
        // --- Log FormData contents (for debugging) ---
        // Note: You can't directly log FormData objects easily.
        // You can iterate through entries if needed:
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        // --- Make the fetch request with the received FormData ---
        const response = await fetch(url, {
          method: method,
          body: formDataFromModal, // Send the FormData object received from the modal
          // NO 'Content-Type' header - browser sets it automatically for FormData
      });

         // Check response status before parsing JSON
        if (!response.ok) {
          // Try to get more detailed error from backend response body
          const errorText = await response.text(); // Read as text first
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


        // Assuming backend sends back the saved/updated space object on success
        const responseData = await response.json(); 
        console.log("Space saved successfully:", responseData);
        setIsSpaceModalOpen(false); // Close modal on success
        setEditingSpace(null);
        fetchSpaces(); // Refresh list
    } catch (e) {
        console.error("Failed to save space catch block:", e);
        setError(`Failed to save space. ${e.message}`); // Display the constructed error message
        // Keep modal open on error
    } finally {
        setIsLoading(false);
    }
  };


  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading && activeItem === 'user-management' && !users) {
         return <div className="text-center py-10">Loading Users...</div>;
    }
    if (isLoading && activeItem === 'space-management' && !spaces) {
      return <div className="text-center py-10">Loading Spaces...</div>;
    }
     if (error) {
         return <div className="text-center py-10 text-red-600">Error: {error}</div>;
     }
     if (isLoading) {
      return <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F9FE5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Saving space details...</p>
      </div>;
  }

    switch (activeItem) {
      case "user-management":
        return <UserManagement 
          users={users} 
          onEdit={handleEditUserClick} 
          onDelete={handleOpenUserDeleteConfirm} // Pass the function to open the confirm modal
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
        // TODO: Render BookingManagement component with fetched bookings and handlers
        return <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Booking Management</h2>
          <p className="text-gray-500">This feature is coming soon.</p>
          </div>;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  
  return (
    // Main flex container for full-page layout
    <div className="flex min-h-screen"> 
      {/* Sidebar Container: Fixed width, light blue background, full height */}
      <div className="w-64 flex-shrink-0 bg-[#EBF6FC] h-screen sticky top-0"> 
        {/* Optional: Add a header/logo area inside the sidebar if needed */}
        {/* <div className="h-16 flex items-center justify-center text-[#2F9FE5] font-semibold text-lg">Admin Menu</div> */}
        <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      </div>

      {/* Main Content Area: Takes remaining space, light gray background, padding, scrollable */}
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
            <StatsCard title="Total Bookings" value={isLoading ? '...' : (bookings ? bookings.length : '0')} />
          </div>
          {/* End Stats Cards */}

          {/* Dynamic Content Area - UserManagement now has white bg */}
          {renderContent()}
          {/* End Dynamic Content Area */}

          {/* Modal rendering logic remains the same */}
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

          {/* Space Form Modal */}
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

      </div> {/* End Main Content Area */}
    </div> /* End Main Flex Container */
  );
};

export default AdminPage;