import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { format } from "date-fns";

export const BookingManagement = ({ bookings, onEdit, onCancel, onDelete }) => {
  const [activeFilter, setActiveFilter] = useState('Booked');
  
  if (!bookings) {
    return <div>Loading bookings...</div>;
  }

  const filterOptions = ['Booked', 'Cancelled', 'Completed'];

  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    let effectiveStatus = booking.status;
    // Dynamically determine if a 'BOOKED' booking is now 'COMPLETED'
    if (booking.status === 'BOOKED' && booking.endTime && new Date(booking.endTime) < new Date()) {
      effectiveStatus = 'COMPLETED';
    }
    return effectiveStatus === activeFilter.toUpperCase();
  });

  const getStatusBadgeClass = (status) => {
    if (!status) return "bg-gray-200 text-gray-800";
    
    switch (status.toUpperCase()) {
      case 'BOOKED':
        return "bg-blue-100 text-blue-800";
      case 'CANCELLED':
        return "bg-red-100 text-red-800";
      case 'COMPLETED':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatDateTime = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString || 'N/A';
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Booking Management</h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className={`capitalize ${activeFilter === filter ? 'bg-[#2F9FE5] hover:bg-[#2387c9]' : ''}`}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Fixed height container with scrolling */}
        <div className="h-[600px] overflow-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b text-sm font-medium text-gray-500">
                  <th className="text-left pb-3 pt-2 px-3 w-16">ID</th>
                  <th className="text-left pb-3 pt-2 px-3 w-56">Space</th>
                  <th className="text-left pb-3 pt-2 px-3 w-48">User</th>
                  <th className="text-left pb-3 pt-2 px-3 w-44">Start Time</th>
                  <th className="text-left pb-3 pt-2 px-3 w-44">End Time</th>
                  <th className="text-center pb-3 pt-2 px-3 w-24">People</th>
                  <th className="text-right pb-3 pt-2 px-3 w-28">Price</th>
                  <th className="text-left pb-3 pt-2 px-3 w-28">Status</th>
                  <th className="text-right pb-3 pt-2 px-3 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b last:border-b-0 hover:bg-gray-50 text-sm text-gray-700">
                    <td className="py-3 px-3 truncate">{booking.id}</td>
                    <td className="py-3 px-3">
                      <div className="truncate" title={booking.spaceName || 'N/A'}>
                        {booking.spaceName || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div>
                        <div className="truncate" title={booking.userName || 'N/A'}>
                          {booking.userName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 truncate" title={booking.userEmail || 'N/A'}>
                          {booking.userEmail || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 truncate" title={formatDateTime(booking.startTime)}>
                      {formatDateTime(booking.startTime)}
                    </td>
                    <td className="py-3 px-3 truncate" title={formatDateTime(booking.endTime)}>
                      {formatDateTime(booking.endTime)}
                    </td>
                    <td className="py-3 px-3 text-center">{booking.numberOfPeople}</td>
                    <td className="py-3 px-3 text-right">₱{booking.totalPrice?.toFixed(2) || 'N/A'}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {booking.status === 'BOOKED' && (
                        <>
                          <button
                            onClick={() => onEdit(booking)}
                            className="text-[#2F9FE5] hover:underline font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onCancel(booking.id)}
                            className="text-yellow-500 hover:underline font-medium ml-2"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onDelete(booking.id)}
                        className="text-red-500 hover:underline font-medium ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredBookings.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No {activeFilter.toLowerCase()} bookings found.
          </div>
        )}
      </div>
    </div>
  );
};
