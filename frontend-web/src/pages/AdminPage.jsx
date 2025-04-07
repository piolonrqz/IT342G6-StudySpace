import { useState, useEffect } from 'react';
import Sidebar from "../Components/Sidebar";
import AdminDashboard from "../Components/AdminDashboard";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8080/api'; // Adjust this to your Spring Boot API URL

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (newUser) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const addedUser = await response.json();
      setUsers([...users, addedUser]);
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. Please try again.');
      return false;
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setUsers(users.filter(user => user.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
      return false;
    }
  };

  const editUser = async (id, updatedUser) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedUserFromServer = await response.json();
      setUsers(users.map(user => user.id === id ? updatedUserFromServer : user));
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
      return false;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <AdminDashboard
          users={users}
          addUser={addUser}
          deleteUser={deleteUser}
          editUser={editUser}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
}

export default AdminPage;