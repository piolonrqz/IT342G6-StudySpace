import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // Import AuthProvider
import { Toaster } from "@/Components/ui/toaster"; // Import the Toaster

import Homepage from './pages/Homepage.jsx';
import SpacesPage from './pages/SpacesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute.jsx';
import WhyStudySpace from './pages/WhyStudySpace.jsx';
import Bookings from './pages/Bookings.jsx';
import AdminPage from './pages/AdminPage.jsx';
import SpaceDetails from './pages/SpaceDetails';
//import ProfilePage from './pages/ProfilePage'; // Import the ProfilePage component (you'll need to create this)
// You might also need NavigationBar and Footer if they are part of the main layout
// import NavigationBar from './Components/NavigationBar';
// import Footer from './Components/Footer';
import OAuthCallBack from './Components/OAuthCallBack.jsx';

function App() {
  return (
    // Wrap AuthProvider with Router
    <Router>
      <AuthProvider>
        {/* Optional: Add Nav/Footer here if they should appear on all pages */}
        {/* <NavigationBar /> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/SpacesPage" element={<SpacesPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/WhyStudySpace" element={<WhyStudySpace />} />
          <Route path="/oauth/callback" element={<OAuthCallBack />} />
          <Route path="/Bookings" element={<Bookings />} />
          {/* Removed the duplicate /AdminPage route */}
          <Route path="/space/:id" element={<SpaceDetails />} />
          {/*<Route path="/profile" element={<ProfilePage />} /> {/* Add the route for the profile page */}

          {/* Protected Admin Route */}
          <Route
            path="/AdminPage"
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
        {/* Render the Toaster component here */}
        <Toaster /> 
        {/* <Footer /> */}
      </AuthProvider>
    </Router>
  );
}

export default App;