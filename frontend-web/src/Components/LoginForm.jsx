import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, { 
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
    // Redirect to Google OAuth2 endpoint - Construct URL using the base URL
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
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
              {/* Add relative positioning to the container div */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Add padding to the right for the icon
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none pr-10"
                  placeholder="Enter your password"
                  required
                />
                {/* Position the button absolutely within the relative container */}
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  // Use absolute positioning and icon styling
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-sky-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {/* Render Eye or EyeOff icon */}
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Remove the old text-based button container */}
              {/* <div className="text-right mt-1"> ... </div> */}
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
            <div className="text-center text-sm text-gray-500 mb-2">Or sign in with</div>
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                aria-label="Sign in with Google"
            >
                <img src="/google_logo.png" alt="Google logo" className="h-5 w-5" />
                Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;