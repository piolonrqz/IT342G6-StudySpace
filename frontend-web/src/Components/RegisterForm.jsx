import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [added, setAdded] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const nameRegex = /^[A-Za-z\s]+$/;
  //   const capitalizeName = name.replace(/\b\w/g, (char) => char.toUpperCase());
  //   if (!nameRegex.test(name)) {
  //     setValidationError('Name must only contain letters and spaces.');
  //     setAdded(false);
  //     return;
  //   }

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     setValidationError('Please enter a valid email address.');
  //     setAdded(false);
  //     return;
  //   }

  //   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  //   if (!passwordRegex.test(password)) {
  //     setValidationError('Password must be at least 8 characters with letters and numbers.');
  //     setAdded(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`http://localhost:8080/user/check-email?email=${encodeURIComponent(email)}`);
  //     const isEmailUnique = await response.json();

  //     if (!isEmailUnique) {
  //       setValidationError('Email already exists. Please use a different email.');
  //       return;
  //     }

  //     const student = { name: capitalizeName, email, password };
  //     await fetch("http://localhost:8080/user/save", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(student)
  //     });

  //     setAdded(true);
  //     setValidationError('');

  //     setTimeout(() => {
  //       navigate('/login');
  //     }, 2000);

  //   } catch (error) {
  //     setValidationError('An error occurred. Please try again.');
  //   }
  // };

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
      const response = await fetch(`http://localhost:8080/api/users/check-email?email=${encodeURIComponent(email)}`);
      const isEmailUnique = await response.json();

      if (!isEmailUnique) {
        setValidationError('Email already exists. Please use a different email.');
        return;
      }

      const student = { name: capitalizeName, email, password };
      await fetch("http://localhost:8080/api/users/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });

      setAdded(true);
      setValidationError('');

      setTimeout(() => {
        navigate('/LoginPage');
      }, 2000);

    } catch (error) {
      setValidationError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* Left side image */}
      <div
        className="hidden md:block w-1/4 bg-cover bg-center"
        style={{ backgroundImage: "url(/side_frame.png)" }}
      ></div>

      {/* Right side form */}
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
              <label className="block text-sm text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Enter your name"
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
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
