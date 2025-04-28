import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  // const [name, setName] = useState(''); // Can likely remove this state
  // const [great, setGreat] = useState(false); // Can likely remove this state
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setValidationError('');

    try {
      const response = await fetch("https://it342g6-studyspace.onrender.com/api/users/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
           const errorData = await response.json().catch(() => ({})); 
           throw new Error(errorData.error || `HTTP error! status: ${response.status}`); 
      }

      const userData = await response.json();

      // Call the login function from AuthContext
      login(userData, userData.token);

      // Redirect based on role
      if (userData.role === 'ADMIN') {
        navigate("/AdminPage"); // Make sure /AdminPage route exists
      } else {
        navigate("/"); // Redirect regular users to home
      }

    } catch (err) {
      console.error("Error signing in:", err);
      setValidationError(err.message || "An error occurred during login.");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth2 endpoint
    window.location.href = 'https://it342g6-studyspace.onrender.com/oauth2/authorization/google';
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* Left side image */}
      <div
        className="hidden md:block w-1/4 bg-auto bg-center"
        style={{ backgroundImage: "url(/side_frame.png)" }}
      ></div>

      {/* Right side form */}
      <div className="w-full md:w-3/5 flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-10">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Sign in</h1>

          <p className="text-center text-sm mb-8 text-gray-600">
            Don't have an account?{' '}
            <Link to="/RegisterPage" className="text-sky-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          <form onSubmit={handleSignIn} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="text-xs text-gray-500 hover:text-sky-600"
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>
            </div>

            {validationError && (
              <div className="text-red-600 text-sm text-center">{validationError}</div>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition"
            >
              Sign In
            </button>

            {/* Removed the 'great' message - login status is now global */}
            {/* {great && (
              <div className="text-green-600 text-sm text-center">
                Welcome back, {name}!
              </div>
            )} */}
          </form>

          <div className="mt-6">
            <hr className="mb-4 border-t border-gray-300" />
            <div className="text-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full p-3 bg-white font-semibold hover:border-gray-400 transition flex items-center justify-center"
                aria-label="Sign in with Google"
                style={{
                  backgroundImage: "url(/google.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "40px 40px",
                  padding: "20px",
                }}
              >
                <span className="sr-only">Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;