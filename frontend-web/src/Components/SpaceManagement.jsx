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
        {/* Removed potential whitespace before <thead> */}
        <table className="w-full table-auto"><thead>{/* Moved <thead> directly after <table> */}
            <tr className="border-b text-sm font-medium text-gray-500">{/* Ensure no whitespace before first <th> */}
              <th className="text-left pb-3 pt-2 px-3 w-12">ID</th>
              <th className="text-left pb-3 pt-2 px-3 w-16">Image</th>
              <th className="text-left pb-3 pt-2 px-3 min-w-[20px]">Name</th>
              <th className="text-left pb-3 pt-2 px-3 min-w-[20px]">Location</th>
              <th className="text-center pb-3 pt-2 px-3 w-20">Capacity</th>
              <th className="text-left pb-3 pt-2 px-3 w-60">Type</th>
              <th className="text-left pb-3 pt-2 px-3 w-28">Availability</th> 
              <th className="text-left pb-3 pt-2 px-3 w-20">Opens</th>
              <th className="text-left pb-3 pt-2 px-3 w-20">Closes</th>
              <th className="text-right pb-3 pt-2 px-3 w-24">Price</th>
              <th className="text-right pb-3 pt-2 px-3 w-28">Actions</th>
            </tr>{/* Ensure no whitespace after last <th> */}
          </thead>{/* Ensure no whitespace before <tbody> */}<tbody>{/* Moved <tbody> directly after </thead> */}
            {spaces.map((space) => (
              // Ensure no whitespace before first <td>
              <tr key={space.id} className="border-b last:border-b-0 hover:bg-gray-50 text-sm text-gray-700"><td className="py-3 px-3">{space.id}</td> 
                <td className="py-2 px-3"> 
                  {space.imageFilename ? ( 
                    <img 
                      /* Change the src URL to match MvcConfig */
                      src={`/uploads/${space.imageFilename}`} 
                      alt={space.name || 'Space image'} 
                      className="h-10 w-10 object-cover rounded" 
                      onError={(e) => { e.target.style.display='none'; }} 
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No img</div>
                  )}
                </td>
                <td className="py-3 px-3">{space.name}</td>
                <td className="py-3 px-3">{space.location}</td>
                <td className="py-3 px-3 text-center">{space.capacity}</td>
                <td className="py-3 px-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}>
                     {formatSpaceType(space.spaceType)}
                  </span>
                </td>
                 <td className="py-3 px-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${space.available ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }`}>
                     {space.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="py-3 px-3">{space.openingTime}</td> 
                <td className="py-3 px-3">{space.closingTime}</td> 
                <td className="py-3 px-3 text-right">{formatPrice(space.price)}</td>
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
              </tr>// Ensure no whitespace after the <tr> or between <tr> elements
            ))}
          </tbody>{/* Ensure no whitespace after <tbody> */}
        </table>
      </div>
       {spaces.length === 0 && <p className="text-center py-4 text-gray-500">No spaces found.</p>}
    </div>
  );
};