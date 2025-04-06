import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [added, setAdded] = useState(false);
  
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nameRegex = /^[A-Za-z\s]+$/;
    const capitalizeName = name.replace(/\b\w/g, (char) => char.toUpperCase());
    if (!nameRegex.test(name)) {
      setValidationError('Name must only contain letters and spaces.');
      setAdded(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      setAdded(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setValidationError('Password must be at least 8 characters with letters and numbers.');
      setAdded(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/user/check-email?email=${encodeURIComponent(email)}`);
      const isEmailUnique = await response.json();

      if (!isEmailUnique) {
        setValidationError('Email already exists. Please use a different email.');
        return;
      }

      const student = { name: capitalizeName, email, password };
      await fetch("http://localhost:8080/user/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
      setAdded(true);
      setValidationError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setValidationError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Hero Image */}
      <div 
        className="hidden md:block w-2/5 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/6214557/pexels-photo-6214557.jpeg)' }}
      ></div>

      {/* Right side - Sign Up Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center font-sans">
        <div className="w-full max-w-md px-5">
          <h1 className="text-3xl font-bold text-center mb-6">Sign up</h1>

          <p className="text-center text-sm mb-8">
            Already have an account?{' '}
            <a href="/login" className="text-red-600 font-bold hover:underline">
              Sign In
            </a>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700">Username</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm mb-2 text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {validationError && (
              <div className="text-red-600 text-sm text-center">
                {validationError}
              </div>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors mt-4"
            >
              Sign Up
            </button>

            {added && (
              <div className="text-green-600 text-sm text-center">
                Account created successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;