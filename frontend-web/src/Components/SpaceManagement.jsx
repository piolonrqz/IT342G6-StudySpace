import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";

// Define and export the SpaceManagement component
export const SpaceManagement = ({ spaces, onEdit, onDelete, onAdd }) => {
  if (!spaces) {
    return <div>Loading spaces...</div>; // Basic loading state
  }

  // Helper function for formatting space type
  const formatSpaceType = (type) => {
    if (!type) return '';
    return type.replace(/_/g, ' '); // Replace underscores with spaces
  };

  // Helper function for formatting price
  const formatPrice = (price) => {
    // Check if price is a valid number
    if (price === null || price === undefined || isNaN(Number(price))) {
      return 'N/A'; // Or '-' or some other placeholder
    }
    // Format to 2 decimal places (e.g., 15.50)
    // Consider adding a currency symbol if needed: return `$${Number(price).toFixed(2)}`;
    return `₱${Number(price).toFixed(2)}`;
  };

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
        {/* Use table-fixed for more predictable column widths if needed, or leave as table-auto */}
        <table className="w-full table-auto"> {/* Changed to table-auto for flexibility */}
          <thead>
            <tr className="border-b text-sm font-medium text-gray-500">
              {/* Adjust widths for better balance */}
              <th className="text-left pb-3 pt-2 px-3 w-12">ID</th> {/* Slightly narrower ID */}
              <th className="text-left pb-3 pt-2 px-3 w-16">Image</th> {/* Keep image width fixed */}
              <th className="text-left pb-3 pt-2 px-3 min-w-[20px]">Name</th> {/* Allow Name to grow */}
              <th className="text-left pb-3 pt-2 px-3 min-w-[20px]">Location</th> {/* Allow Location to grow */}
              <th className="text-center pb-3 pt-2 px-3 w-20">Capacity</th> {/* Centered header */}
              <th className="text-left pb-3 pt-2 px-3 w-60">Type</th> {/* Slightly wider Type */}
              <th className="text-left pb-3 pt-2 px-3 w-28">Availability</th> 
              <th className="text-left pb-3 pt-2 px-3 w-20">Opens</th> {/* Slightly narrower time */}
              <th className="text-left pb-3 pt-2 px-3 w-20">Closes</th> {/* Slightly narrower time */}
              <th className="text-right pb-3 pt-2 px-3 w-24">Price</th>
              <th className="text-right pb-3 pt-2 px-3 w-28">Actions</th> {/* Fixed width for actions */}
            </tr>
          </thead>
          <tbody>
            {spaces.map((space) => (
              <tr key={space.id} className="border-b last:border-b-0 hover:bg-gray-50 text-sm text-gray-700">
                 {/* Ensure content alignment matches header (text-center for capacity) */}
                <td className="py-3 px-3">{space.id}</td> 
                <td className="py-2 px-3"> 
                  {space.imageUrl ? (
                    <img 
                      src={space.imageUrl} 
                      alt={space.name || 'Space image'} 
                      className="h-10 w-10 object-cover rounded" // Adjust size and style as needed
                      onError={(e) => { e.target.style.display='none'; /* Hide if image fails */ }} 
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No img</div> // Placeholder
                  )}
                </td>
                <td className="py-3 px-3">{space.name}</td>
                <td className="py-3 px-3">{space.location}</td>
                <td className="py-3 px-3 text-center">{space.capacity}</td> {/* Centered Capacity Data */}
                <td className="py-3 px-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}>
                     {formatSpaceType(space.spaceType)} {/* Use formatter */}
                  </span>
                </td>
                 <td className="py-3 px-3">
                   {/* Display availability status */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${space.available ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }`}>
                     {space.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="py-3 px-3">{space.openingTime}</td> 
                <td className="py-3 px-3">{space.closingTime}</td> 
                <td className="py-3 px-3 text-right">{formatPrice(space.price)}</td>
                <td className="py-3 px-3 text-right">
                   { /* ... unchanged Edit/Delete buttons ... */ }
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