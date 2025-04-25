import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "Female",
    password: user?.password || "••••••••"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateUser(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins flex flex-col">
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="text-xl font-medium mb-6">My account</h2>
              
              <nav className="space-y-2">
                <a href="#" className="block py-2 px-3 bg-gray-100 text-gray-900 rounded">My details</a>
              </nav>
              
              <button className="mt-8 w-full border bg-sky-500 rounded py-2 px-4 text-gray-100 hover:bg-sky-400 transition">
                Log out
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="text-xl font-medium mb-6">My details</h2>
              
              {/* Profile Picture */}
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    {user?.firstName ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 text-xl font-medium">
                        {user.firstName.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </div>
                    ) : (
                      <img src="/api/placeholder/64/64" alt="Profile" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                  <div className="flex space-x-4 mt-2">
                    <button className="text-sm border border-gray-300 rounded-full px-4 py-1 hover:bg-gray-50">
                      Upload new picture
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Form */}
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none appearance-none bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                    placeholder="(+63) 921 701 1868"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full md:w-auto px-6 py-3 bg-sky-500 text-white rounded font-medium hover:bg-sky-300 transition"
                  >
                    Save my details
                  </button>
                </div>
              </form>
            </div>
            
            {/* Newsletter Section */}
            <div className="bg-white p-6 rounded shadow-sm mt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-medium">Subscribe</h3>
                  <p className="text-sm text-gray-600">Sign up for newsletter and get 15% off!</p>
                </div>
                <div className="flex w-full md:w-1/2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow p-3 border border-gray-300 rounded-l-[10px] focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  />
                  <button className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-[10px] p-3 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1.293 11.293a1 1 0 01-1.414-1.414L12.586 10H7a1 1 0 110-2h5.586l-2.293-2.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;