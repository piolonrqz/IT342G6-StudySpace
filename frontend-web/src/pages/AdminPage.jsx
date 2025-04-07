import { useState, useEffect, useCallback } from "react";
import { HomeIcon, CalendarIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserFormModal } from '@/Components/UserFormModal';
import { ConfirmationModal } from "@/Components/ConfirmationModal"; 

// TODO: Import or create Modal components for Add/Edit forms
// import UserFormModal from '@/components/UserFormModal';


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


// --- User Management Component ---
// Extracted UserTable into its own component for better organization
const UserManagement = ({ users, onEdit, onDelete, onAdd }) => {
  if (!users) {
    return <div>Loading users...</div>; // Basic loading state
  }

  return (
    // Ensure this container has a white background
    <div className="bg-white shadow rounded-xl p-6"> 
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2> {/* Adjusted size */}
        <Button onClick={onAdd} className="bg-[#2F9FE5] text-white hover:bg-[#2387c9] rounded-md px-4 py-2 text-sm"> {/* Adjusted styling */}
          Add New User
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {/* Adjusted table header styling */}
            <tr className="border-b text-sm font-medium text-gray-500">
              {/* Added ID column header */}
              <th className="text-left pb-3 pt-2 px-3 w-16">ID</th> 
              <th className="text-left pb-3 pt-2 px-3">Name</th>
              <th className="text-left pb-3 pt-2 px-3">Email</th>
              <th className="text-left pb-3 pt-2 px-3">Role</th> 
              <th className="text-right pb-3 pt-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              // Adjusted table row styling
              <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50 text-sm text-gray-700">
                {/* Added ID cell */}
                <td className="py-3 px-3">{user.id}</td> 
                {/* Adjusted cell padding */}
                <td className="py-3 px-3">{`${user.firstName} ${user.lastName}`}</td>
                <td className="py-3 px-3">{user.email}</td>
                <td className="py-3 px-3">
                  {/* Display user.role and adjust badge styling based on role */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-[#EBF6FC] text-[#2F9FE5]' }`}>
                     {user.role} {/* Display the actual role */}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                   {/* Reverted to text links as per image */}
                  <button
                    onClick={() => onEdit(user)}
                    className="text-[#2F9FE5] hover:underline font-medium mr-4"
                  >
                     Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-500 hover:underline font-medium"
                  >
                     Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {users.length === 0 && <p className="text-center py-4 text-gray-500">No users found.</p>}
    </div>
  );
};

// Placeholder components for other sections
const SpaceManagement = () => <div>Space Management Section - TODO</div>;
const BookingManagement = () => <div>Booking Management Section - TODO</div>;


// --- Main AdminPage Component ---
const AdminPage = () => {
  const [activeItem, setActiveItem] = useState("user-management");
  const [users, setUsers] = useState(null); // State for users data
  const [spaces, setSpaces] = useState(null); // State for spaces data (TODO)
  const [bookings, setBookings] = useState(null); // State for bookings data (TODO)
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for delete confirmation modal
  const [userToDeleteId, setUserToDeleteId] = useState(null); // State to store the ID of the user to be deleted

  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // State for user modal
  const [editingUser, setEditingUser] = useState(null); // State for user being edited

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

  // Fetch data based on active item
  useEffect(() => {
    if (activeItem === "user-management") {
      fetchUsers();
    } else if (activeItem === "space-management") {
      // TODO: Fetch spaces -> Similar pattern to fetchUsers
      console.log("Fetching Spaces (TODO)");
       setSpaces([]); // Placeholder
    } else if (activeItem === "booking-management") {
      // TODO: Fetch bookings -> Similar pattern to fetchUsers
       console.log("Fetching Bookings (TODO)");
       setBookings([]); // Placeholder
    }
  }, [activeItem, fetchUsers]); // Rerun when activeItem or fetchUsers changes


  // --- CRUD Handlers ---

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
  const handleOpenDeleteConfirm = (userId) => {
    setUserToDeleteId(userId);    // Store the ID of the user to delete
    setIsConfirmModalOpen(true); // Open the confirmation modal
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
      setIsConfirmModalOpen(false); // Close the confirmation modal on success
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


  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading && activeItem === 'user-management' && !users) {
         return <div className="text-center py-10">Loading...</div>;
    }
     if (error) {
         return <div className="text-center py-10 text-red-600">Error: {error}</div>;
     }

    switch (activeItem) {
      case "user-management":
        return <UserManagement 
          users={users} 
          onEdit={handleEditUserClick} 
          onDelete={handleOpenDeleteConfirm} // Pass the function to open the confirm modal
          onAdd={handleAddUserClick} 
        />;
      case "space-management":
        // TODO: Render SpaceManagement component with fetched spaces and handlers
        return <SpaceManagement />;
      case "booking-management":
        // TODO: Render BookingManagement component with fetched bookings and handlers
        return <BookingManagement />;
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

          {/* Delete Confirmation Modal */}
          {isConfirmModalOpen && (
             <ConfirmationModal
                 isOpen={isConfirmModalOpen}
                 onClose={() => {
                     setIsConfirmModalOpen(false);
                     setUserToDeleteId(null);
                     // Optionally clear error if it's specific to delete
                     // setError(null); 
                 }}
                 onConfirm={performDeleteUser} // Pass the actual delete function
                 title="Delete User?"
                 description={`Are you sure you want to delete user ID: ${userToDeleteId}? This action cannot be undone.`}
                 confirmText="Delete"
                 isLoading={isLoading} // Indicate loading during delete operation
             />
          )}

      </div> {/* End Main Content Area */}
    </div> /* End Main Flex Container */
  );
};

export default AdminPage;