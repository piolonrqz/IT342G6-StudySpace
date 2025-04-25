import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const OAuthCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Use a ref to track if we've already processed the login
  const hasProcessedLogin = useRef(false);

  useEffect(() => {
    // Only run this effect once
    if (hasProcessedLogin.current) return;

    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const profilePictureFilename = searchParams.get('profilePictureFilename');
  
    if (token && role && userId) {
      // Create a user object with the data from URL parameters
      const userData = {
        id: userId,
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        role: role,
        // Add profilePictureFilename if available, otherwise set to null
        // This makes it clear this is a Google user without a custom profile picture
        profilePictureFilename: profilePictureFilename || null
      };

      try {
        // Mark as processed before any async operations
        hasProcessedLogin.current = true;
        
        // Call the login function from AuthContext
        login(userData, token);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${firstName || 'User'}!`,
        });

        // Use setTimeout to avoid React's batched updates issues
        setTimeout(() => {
          // Redirect based on role
          if (role === 'ADMIN') {
            navigate("/AdminPage", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 100);
      } catch (error) {
        console.error('Login error:', error);
        toast({
          title: "Authentication error",
          description: "An error occurred during login. Please try again.",
          variant: "destructive"
        });
        
        setTimeout(() => {
          navigate('/LoginPage', { replace: true });
        }, 100);
      }
    } else {
      // Mark as processed
      hasProcessedLogin.current = true;
      
      console.error('Missing token, role, or userId from OAuth provider.');
      
      toast({
        title: "Authentication failed",
        description: "Could not complete the login process. Please try again.",
        variant: "destructive"
      });
      
      // Use setTimeout to delay navigation
      setTimeout(() => {
        navigate('/LoginPage', { replace: true });
      }, 100);
    }
  }, []); // Empty dependency array - only run once on mount
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Processing login...</h2>
        <p className="text-center text-gray-600">Please wait while we authenticate you.</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallBack;