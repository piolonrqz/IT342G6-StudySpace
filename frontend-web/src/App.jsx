import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Homepage from './pages/Homepage.jsx';
import SpacesPage from './pages/SpacesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute.jsx'
import WhyStudySpace from './pages/WhyStudySpace.jsx';
import Bookings from './pages/Bookings.jsx';
import WhyStudySpace from './pages/WhyStudySpace.jsx';
import Bookings from './pages/Bookings.jsx';
import AdminPage from './pages/AdminPage.jsx'; 
import ProtectedAdminRoute from './Components/ProtectedAdminRoute.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/SpacesPage" element={<SpacesPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/WhyStudySpace" element={<WhyStudySpace />} />

        <Route path='/Bookings' element= {<Bookings />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        
        {/* Protect the AdminPage route */}
        {/* <Route

          path="/AdminPage"
          element={
            <ProtectedAdminRoute>
              {/* <AdminPage /> */}
            </ProtectedAdminRoute>
          }
        /> */}
        
        <Route path="/Bookings" element={<Bookings />} />
        <Route path="/AdminPage" element={<AdminPage />} />

        {/*  Protected Admin Route */}
        <Route
          path="/AdminPage"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
