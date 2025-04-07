import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import SpacesPage from './pages/SpacesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute.jsx'
import WhyStudySpace from './pages/WhyStudySpace.jsx';
import Bookings from './pages/Bookings.jsx';
// ... other page imports

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

        {/* Protect the AdminPage route */}
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