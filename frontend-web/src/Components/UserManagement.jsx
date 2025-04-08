import React from 'react';
import { Button } from "@/components/ui/button"; // Import Button component

// Define and export the UserManagement component
export const UserManagement = ({ users, onEdit, onDelete, onAdd }) => {
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
