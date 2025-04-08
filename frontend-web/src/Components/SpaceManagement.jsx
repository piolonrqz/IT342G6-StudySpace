import React from 'react';
import { Button } from "@/components/ui/button"; 

// Define and export the SpaceManagement component
export const SpaceManagement = ({ spaces, onEdit, onDelete, onAdd }) => {
  if (!spaces) {
    return <div>Loading spaces...</div>; // Basic loading state
  }

  return (
    // Container with white background and shadow
    <div className="bg-white shadow rounded-xl p-6"> 
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Space Management</h2> 
        <Button onClick={onAdd} className="bg-[#2F9FE5] text-white hover:bg-[#2387c9] rounded-md px-4 py-2 text-sm">
          Add New Space
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-sm font-medium text-gray-500">
              <th className="text-left pb-3 pt-2 px-3 w-16">ID</th> 
              <th className="text-left pb-3 pt-2 px-3">Name</th>
              <th className="text-left pb-3 pt-2 px-3">Location</th>
              <th className="text-left pb-3 pt-2 px-3">Capacity</th> 
              <th className="text-left pb-3 pt-2 px-3">Type</th>
              <th className="text-left pb-3 pt-2 px-3">Availability</th> 
              <th className="text-right pb-3 pt-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((space) => (
              <tr key={space.id} className="border-b last:border-b-0 hover:bg-gray-50 text-sm text-gray-700">
                <td className="py-3 px-3">{space.id}</td> 
                <td className="py-3 px-3">{space.name}</td>
                <td className="py-3 px-3">{space.location}</td>
                <td className="py-3 px-3">{space.capacity}</td>
                <td className="py-3 px-3">
                   {/* Basic display for spaceType, adjust styling as needed */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}>
                     {space.spaceType} 
                  </span>
                </td>
                 <td className="py-3 px-3">
                   {/* Display availability status */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${space.available ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }`}>
                     {space.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onEdit(space)}
                    className="text-[#2F9FE5] hover:underline font-medium mr-4"
                  >
                     Edit
                  </button>
                  <button
                    onClick={() => onDelete(space.id)}
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
       {spaces.length === 0 && <p className="text-center py-4 text-gray-500">No spaces found.</p>}
    </div>
  );
};