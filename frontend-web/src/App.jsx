import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import SpacesPage from './pages/SpacesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute.jsx';
// ... other page imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/SpacesPage" element={<SpacesPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        {/* Protect the AdminPage route */}
        <Route
          path="/AdminPage"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />
        {/* ... other routes ... */}
      </Routes>
    </Router>
  );
}

export default App;