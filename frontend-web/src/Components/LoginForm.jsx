import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [name, setName] = useState('');
  const [great, setGreat] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setValidationError('');

    try {
      let response = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const adminData = await response.json();
        localStorage.setItem("adminToken", adminData.token);
        localStorage.setItem("role", adminData.role);
        localStorage.setItem("currentUser", JSON.stringify({
          email,
          name: adminData.name,
          role: adminData.role
        }));
        setName(adminData.name);
        setGreat(true);
        navigate("/admin");
        return;
      }

      response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const userData = await response.json();
      localStorage.setItem("jwtToken", userData.token);
      localStorage.setItem("role", userData.role || "User");
      localStorage.setItem("currentUser", JSON.stringify({
        email,
        id: userData.id,
        name: userData.name,
        role: userData.role || "User",
        prof_pic: userData.prof_pic
      }));
      setName(userData.name);
      setGreat(true);
      navigate("/");
    } catch (err) {
      console.error("Error signing in:", err);
      setValidationError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Hero Image */}
      <div className="hidden md:block w-2/5 bg-cover bg-center" 
           style={{ backgroundImage: 'url(/src/assets/images/side_frame.png)' }}>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center font-sans">
        <div className="w-full max-w-md px-5">
          <h1 className="text-3xl font-bold text-center mb-6">Sign in</h1>

          <p className="text-center text-sm mb-8">
            Don't have an account?{' '}
            <a href="/signup" className="text-red-600 font-bold hover:underline">
              Sign Up
            </a>
          </p>

          <form onSubmit={handleSignIn} className="flex flex-col gap-6">
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
              Sign In
            </button>

            {great && (
              <div className="text-green-600 text-sm text-center">
                Welcome back, {name}!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;