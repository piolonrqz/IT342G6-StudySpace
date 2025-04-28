import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [added, setAdded] = useState(false);

  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^09\d{9}$/;
    const capitalize = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setValidationError('Names must only contain letters and spaces.');
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      setValidationError('Phone number must be a valid PH number starting with 09 and 11 digits long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setValidationError('Password must be at least 8 characters with letters and numbers.');
      return;
    }

    // Check if email already exists
    setCheckingEmail(true);
    try {
      const checkResponse = await fetch(`https://it342g6-studyspace.onrender.com/api/users/check-email?email=${encodeURIComponent(email)}`);
      const emailExists = await checkResponse.json();
      if (emailExists) {
        setValidationError('Email already exists. Please use a different one.');
        return;
      }

      const user = {
        firstName: capitalize(firstName),
        lastName: capitalize(lastName),
        email,
        password,
        phoneNumber,
        emailVerified: false,
        role: "USER"
      };

      // Proceed with registration
      setLoading(true);
      try {
        const response = await fetch("https://it342g6-studyspace.onrender.com/api/users/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        });

        if (!response.ok) {
          throw new Error("Failed to create account");
        }

        setAdded(true);
        setValidationError('');

        setTimeout(() => {
          navigate('/LoginPage');
        }, 2000);

      } catch (error) {
        console.error(error);
        setValidationError('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setValidationError('An error occurred. Please try again.');
    }
  };

  const handleGoogleRegister = () => {
    // Redirect to Google OAuth2 endpoint for registration/login
    window.location.href = 'https://it342g6-studyspace.onrender.com/oauth2/authorization/google';
  };

  return (
    <div className="flex h-screen font-poppins">
      <div
        className="hidden md:block w-1/4 bg-cover bg-center"
        style={{ backgroundImage: "url(/side_frame.png)" }}
      ></div>

      <div className="w-full md:w-3/5 flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-10">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>

          <p className="text-center text-sm mb-8 text-gray-600">
            Already have an account?{' '}
            <Link to="/LoginPage" className="text-sky-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div>
              <label className="block text-sm text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Enter your last name"
                required
              />
            </div>

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
              <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
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
                  {showPassword ? 'Hide Password' : 'Show Password'}
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
              Sign Up
            </button>

            {added && (
              <div className="text-green-600 text-sm text-center">
                Account created successfully!
              </div>
            )}
            
          </form>

          <div className="mt-6">
            <hr className="mb-4 border-t border-gray-300" />
            <div className="sr-only">Sign up with Google</div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full p-3 bg-white font-semibold hover:border-gray-400 transition flex items-center justify-center"
                aria-label="Sign up with Google"
                style={{
                  backgroundImage: "url(/google.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "40px 40px",
                  padding: "20px",
                }}
              >
      
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;