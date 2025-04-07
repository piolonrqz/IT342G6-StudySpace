import { useState } from 'react';
import StatCard from './StatCard';
import UserTable from './UserTable';
import UserFormModal from './UserFormModal';

const AdminDashboard = ({ users, addUser, deleteUser, editUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const openAddModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = (userData) => {
    if (currentUser) {
      editUser(currentUser.id, userData);
    } else {
      addUser(userData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-200 rounded-md">SS</div>
          <h1 className="text-2xl font-medium text-primary">StudySpace Admin</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Users" value={users.length} bgColor="bg-light-blue" />
        <StatCard title="Active Spaces" value="342" bgColor="bg-light-blue" />
        <StatCard title="Total Bookings" value="893" bgColor="bg-light-blue" />
      </div>

      <div className="bg-white rounded-md shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">User Management</h2>
          <button 
            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={openAddModal}
          >
            Add New User
          </button>
        </div>
        
        <UserTable 
          users={users} 
          onDelete={deleteUser} 
          onEdit={openEditModal} 
        />
        
        {isModalOpen && (
          <UserFormModal 
            user={currentUser} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleSubmit} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;