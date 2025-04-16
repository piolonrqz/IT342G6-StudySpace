import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role'); // Get the role from query params
  
    if (token && role) {
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userRole', role); // Optional: store role for later use
  
      if (role === 'ADMIN') {
        navigate("/AdminPage");
      } else if (role === 'USER') {
        navigate("/");
      } else {
        navigate("/login"); // Fallback or handle other roles
      }
    } else {
      console.error('Missing token or role from OAuth provider.');
      navigate('/login');
    }
  }, [navigate, searchParams]);
  

  return (
    <div>
      <p>Processing login...</p>
      {/* You can add a loading spinner or message here */}
    </div>
  );
};

export default OAuthCallBack;