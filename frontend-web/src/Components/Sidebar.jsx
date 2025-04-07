import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <div className="bg-primary text-white p-3 rounded-md flex items-center gap-2 cursor-pointer">
          <img src={userIcon} alt="User Icon" className="h-5 w-5" />
          <span>User Management</span>
        </div>

        <div className="mt-4 p-3 hover:bg-gray-100 rounded-md flex items-center gap-2 cursor-pointer">
          <img src={spaceIcon} alt="Space Management Icon" className="h-5 w-5" />
          <span>Space Management</span>
        </div>

        <div className="mt-4 p-3 hover:bg-gray-100 rounded-md flex items-center gap-2 cursor-pointer">
          <img src={calendar} alt="Booking Management Icon" className="h-5 w-5" />
          <span>Booking Management</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;