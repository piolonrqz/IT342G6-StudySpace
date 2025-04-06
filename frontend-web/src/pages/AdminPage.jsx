import { useState, useEffect, useCallback } from "react";
import { HomeIcon, CalendarIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// TODO: Import or create Modal components for Add/Edit forms
// import UserFormModal from '@/components/UserFormModal';

// DashboardLayout Component
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

// StatsCard Component
const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-[#EBF6FC] shadow-sm rounded-xl p-6 flex flex-col justify-center min-w-[250px] flex-1">
      <div>
        <h3 className="text-gray-700 text-base mb-1">{title}</h3>
        <p className="text-4xl font-medium text-gray-900">{value}</p>
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
    <nav className="bg-[#EBF6FC] rounded-lg h-full flex flex-col py-8 px-4">
      <button
        onClick={() => onItemClick("user-management")}
        className={`w-full text-left px-6 py-4 rounded-lg transition-colors ${
          activeItem === "user-management"
            ? "bg-[#2F9FE5] text-white"
            : "hover:bg-[#d9eefa]"
        }`}
      >
        <span className="font-medium">User Management</span>
      </button>
      
      <button
        onClick={() => onItemClick("space-management")}
        className={`w-full text-left mt-6 px-6 py-4 rounded-lg flex items-center gap-3 transition-colors ${
          activeItem === "space-management"
            ? "bg-[#2F9FE5] text-white"
            : "hover:bg-[#d9eefa]"
        }`}
      >
        <HomeIcon className="h-5 w-5" />
        <span>Space Management</span>
      </button>
      
      <button
        onClick={() => onItemClick("booking-management")}
        className={`w-full text-left mt-6 px-6 py-4 rounded-lg flex items-center gap-3 transition-colors ${
          activeItem === "booking-management"
            ? "bg-[#2F9FE5] text-white"
            : "hover:bg-[#d9eefa]"
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
    <div className="bg-white shadow-sm rounded-xl mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-900">User Management</h2>
        <Button onClick={onAdd} className="bg-[#2F9FE5] rounded-full"> {/* Link Add button */}
          Add New User
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-sm font-medium text-gray-700">
              <th className="text-left pb-3 pl-2">ID</th> {/* Added ID */}
              <th className="text-left pb-3 pl-2">Name</th>
              <th className="text-left pb-3">Email</th>
              <th className="text-left pb-3">Role</th> {/* Changed Status to Role */}
              <th className="text-right pb-3 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-b-0"> {/* Use user.id as key */}
                <td className="py-4 pl-2">{user.id}</td> {/* Display ID */}
                <td className="py-4 pl-2">{`${user.firstName} ${user.lastName}`}</td> {/* Combine names */}
                <td className="py-4">{user.email}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-[#EBF6FC] text-[#2F9FE5]' }`}>
                    {user.role} {/* Display Role */}
                  </span>
                </td>
                <td className="py-4 pr-2 text-right">
                  <button
                    onClick={() => onEdit(user)} // Pass user object to edit handler
                    className="text-[#2F9FE5] mr-4 inline-flex items-center hover:underline"
                  >
                     <EditIcon className="h-4 w-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)} // Pass user ID to delete handler
                    className="text-red-500 inline-flex items-center hover:underline"
                  >
                     <TrashIcon className="h-4 w-4 mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {users.length === 0 && <p className="text-center py-4 text-gray-500">No users found.</p>} {/* Handle empty state */}
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

  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // State for user modal
  const [editingUser, setEditingUser] = useState(null); // State for user being edited

  const API_BASE_URL = "http://localhost:8080/api"; // Adjust if your API URL is different

  // Fetch Users Function
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
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
  const handleDeleteUser = async (userId) => {
     // Optional: Add a confirmation dialog here
     if (!window.confirm(`Are you sure you want to delete user ID: ${userId}?`)) {
         return;
     }

    console.log("Attempting to delete user:", userId);
    setIsLoading(true); // Indicate activity
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/delete/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
          const errorData = await response.text(); // Or response.json() if backend returns JSON error
          throw new Error(`Failed to delete user: ${response.status} - ${errorData}`);
      }
       console.log("User deleted successfully:", userId);
      // Refresh user list after deleting
      fetchUsers();
    } catch (e) {
      console.error("Failed to delete user:", e);
      setError(`Failed to delete user. ${e.message}`);
    } finally {
      setIsLoading(false);
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
        return <UserManagement users={users} onEdit={handleEditUserClick} onDelete={handleDeleteUser} onAdd={handleAddUserClick} />;
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
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-lg bg-[#2F9FE5] flex items-center justify-center text-white">
              <span className="font-bold text-xl">S</span>
            </div>
            <h1 className="text-3xl font-semibold text-[#2F9FE5]">StudySpace Admin</h1>
          </div>
          {/* End Header */}

          {/* Stats Cards -> Update values dynamically */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard title="Total Users" value={isLoading ? '...' : (users ? users.length : '0')} />
            <StatsCard title="Active Spaces" value={isLoading ? '...' : (spaces ? spaces.length : '0')} /> {/* Replace with actual data when fetched */}
            <StatsCard title="Total Bookings" value={isLoading ? '...' : (bookings ? bookings.length : '0')} /> {/* Replace with actual data when fetched */}
          </div>
          {/* End Stats Cards */}

          {/* Dynamic Content Area */}
          {renderContent()}
          {/* End Dynamic Content Area */}

          {/* --- Modal Placeholder --- */}
          {/* TODO: Implement and render your UserFormModal component here, conditionally based on isUserModalOpen */}
          {/* Example:
          {isUserModalOpen && (
            <UserFormModal
              isOpen={isUserModalOpen}
              onClose={() => {
                setIsUserModalOpen(false);
                setEditingUser(null); // Clear editing state when closing
                setError(null); // Optionally clear errors when closing
              }}
              onSave={handleSaveUser}
              user={editingUser} // Pass current user for editing, or null for adding
              isLoading={isLoading} // Pass loading state to modal
              error={error} // Pass error state to potentially display in modal
            />
          )}
          */}
          {/* --- End Modal Placeholder --- */}

        </div> {/* End Main Content */}
      </div> {/* End Flex Container */}
    </DashboardLayout>
  );
};

export default AdminPage;