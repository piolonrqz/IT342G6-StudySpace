import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('jwtToken', token);

      // You might want to decode the token here to get user information
      // Example using a library like 'jwt-decode':
      // import jwt_decode from 'jwt-decode';
      // const decodedToken = jwt_decode(token);
      // localStorage.setItem('currentUser', JSON.stringify(decodedToken));

      // For simplicity, let's just navigate to the homepage
      navigate('/');
    } else {
      // Handle the case where the token is missing (e.g., authentication failed)
      console.error('No token received from OAuth provider.');
      // Maybe redirect to an error page or the login page
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