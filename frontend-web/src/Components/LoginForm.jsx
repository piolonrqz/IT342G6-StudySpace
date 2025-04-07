import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [name, setName] = useState('');
  const [great, setGreat] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setValidationError('');

    try {
      // Try admin login first
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
          role: adminData.role,
        }));
        setName(adminData.name);
        setGreat(true);
        navigate("/admin");
        return;
      }

      // Try user login
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
        prof_pic: userData.prof_pic,
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
