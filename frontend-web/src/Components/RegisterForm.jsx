import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Check, X, Eye, EyeOff } from "lucide-react"; // Import Check, X, Eye, EyeOff icons

const RegisterForm = () => {
  // 2. Update state variables for individual errors and new fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [showPassword, setShowPassword] = useState(false); // Single state for both password fields

  // Individual error states
  const [errors, setErrors] = useState({}); // Use a single errors object

  const [isCheckingEmail, setIsCheckingEmail] = useState(false); // Loading state for email check
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for submission
  const [added, setAdded] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast

  // 3. Password validation helpers (similar to ProfilePage)
  const hasMinLength = (pwd) => pwd && pwd.length >= 8;
  const hasNumber = (pwd) => pwd && /\d/.test(pwd);
  const passwordsMatch = () => password && confirmPassword && password === confirmPassword;

  // 4. Unified Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let currentErrors = { ...errors }; // Copy existing errors

    // Update field value
    if (name === 'firstName') setFirstName(value);
    else if (name === 'lastName') setLastName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'confirmPassword') setConfirmPassword(value);
    else if (name === 'phoneNumber') {
      // Allow only digits, limit to 10
      const digits = value.replace(/\D/g, '');
      const limitedDigits = digits.slice(0, 10);
      setPhoneNumber(limitedDigits);

      // Real-time phone number validation
      if (limitedDigits.length > 0 && limitedDigits.length !== 10) {
        currentErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
      } else {
        // Clear error if valid (10 digits) or empty
        currentErrors.phoneNumber = null;
      }
    }

    // Clear the specific error for other fields being edited
    if (name !== 'phoneNumber' && currentErrors[name]) {
      currentErrors[name] = null;
    }
    // Clear password match error if passwords are being edited
    if ((name === 'password' || name === 'confirmPassword') && currentErrors.confirmPassword) {
       currentErrors.confirmPassword = null;
    }
     // Clear email exists error if email is edited
     if (name === 'email' && currentErrors.emailExists) {
        currentErrors.emailExists = null;
    }

    setErrors(currentErrors); // Update errors state
  };


  // 5. Updated handleSubmit function with detailed validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors on new submission attempt
    let currentErrors = {};

    // Validation logic
    const nameRegex = /^[A-Za-z\s'-]+$/;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    // Phone validation (exactly 10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
        currentErrors.phoneNumber = 'Please enter a valid 10-digit phone number.';
    }
    if (!nameRegex.test(firstName)) {
      currentErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes.';
    }
    if (!nameRegex.test(lastName)) {
      currentErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes.';
    }
    if (!emailRegex.test(email)) {
      currentErrors.email = 'Please enter a valid email address.';
    }
    if (!hasMinLength(password)) {
        currentErrors.password = 'Password must be at least 8 characters long.';
    } else if (!hasNumber(password)) {
        currentErrors.password = 'Password must include at least one number.';
    }
    if (password !== confirmPassword) {
      currentErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      // Find the first error message to show in a toast (optional, but can be helpful)
       const firstErrorMsg = Object.values(currentErrors).find(msg => msg); // Find first non-null error
       toast({
           title: "Validation Error",
           description: firstErrorMsg || "Please fix the errors in the form.",
           variant: "destructive",
       });
      return;
    }

    setIsCheckingEmail(true);
    setErrors({}); // Clear previous errors before API calls

    try {
      // Check email availability
      const checkResponse = await fetch(`http://localhost:8080/api/users/check-email?email=${encodeURIComponent(email)}`);
      const isEmailUnique = await checkResponse.json();

      if (!checkResponse.ok) {
          throw new Error("Failed to check email availability.");
      }

      if (!isEmailUnique) {
        setErrors({ emailExists: 'Email already exists. Please use a different one.' });
        setIsCheckingEmail(false);
        toast({
            title: "Registration Failed",
            description: "Email already exists. Please use a different one.",
            variant: "destructive",
        });
        return;
      }

      setIsCheckingEmail(false);
      setIsSubmitting(true);

      // Proceed with registration
      const capitalize = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());
      const user = {
        firstName: capitalize(firstName),
        lastName: capitalize(lastName),
        email,
        password,
        phoneNumber, // Send the 10-digit number
        emailVerified: false,
        role: "USER"
      };

      const response = await fetch("http://localhost:8080/api/users/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        // Try to get error message from backend response
        let errorMsg = "Failed to create account. Please try again.";
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (parseError) {
            // Ignore if response is not JSON or empty
        }
        throw new Error(errorMsg);
      }

      // Success
      setAdded(true);
      toast({
          title: "Success!",
          description: "Account created successfully. Redirecting to login...",
      });
      setTimeout(() => {
        navigate('/LoginPage');
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);
      // Display API errors (could be email check or save error)
      setErrors({ api: error.message || 'An unexpected error occurred. Please try again.' });
       toast({
           title: "Registration Failed",
           description: error.message || 'An unexpected error occurred. Please try again.',
           variant: "destructive",
       });
    } finally {
      setIsCheckingEmail(false);
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    // Redirect to Google OAuth2 endpoint for registration/login
    window.location.href = 'https://it342g6-studyspace.onrender.com/oauth2/authorization/google';
  };

  // 6. Update JSX with new fields, error displays, and loading states
  return (
    <div className="flex h-screen font-poppins">
      <div
        className="hidden md:block w-1/4 bg-cover bg-center"
        style={{ backgroundImage: "url(/side_frame.png)" }}
      ></div>

      <div className="w-full md:w-3/5 flex items-center justify-center py-10"> {/* Added py-10 for padding */}
        <div className="w-full max-w-md px-6"> {/* Removed py-10 from here */}
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>

          <p className="text-center text-sm mb-8 text-gray-600">
            Already have an account?{' '}
            <Link to="/LoginPage" className="text-sky-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4"> {/* Reduced gap slightly */}

            {/* First Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName" // Add name attribute
                value={firstName}
                onChange={handleInputChange} // Use unified handler
                className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none`}
                placeholder="Enter your first name"
                required
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName" // Add name attribute
                value={lastName}
                onChange={handleInputChange} // Use unified handler
                className={`w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none`}
                placeholder="Enter your last name"
                required
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email" // Add name attribute
                value={email}
                onChange={handleInputChange} // Use unified handler
                className={`w-full p-3 border ${errors.email || errors.emailExists ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none`}
                placeholder="Enter your email"
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              {errors.emailExists && <p className="text-red-500 text-xs mt-1">{errors.emailExists}</p>}
            </div>

            {/* Phone Number with Prefix */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone number</label>
              <div className={`flex rounded-lg overflow-hidden border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}>
                <div className="bg-gray-100 py-3 px-4 text-gray-600 border-r border-gray-300">+63</div>
                <input
                  type="tel" // Use tel type
                  name="phoneNumber" // Add name attribute
                  value={phoneNumber}
                  onChange={handleInputChange} // Use unified handler
                  className={`flex-grow p-3 border-0 focus:ring-2 focus:ring-sky-500 focus:outline-none`}
                  placeholder="9xxxxxxxxx"
                  required
                  maxLength="10" // Max length attribute
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                 <input
                    type={showPassword ? 'text' : 'password'}
                    name="password" // Add name attribute
                    value={password}
                    onChange={handleInputChange} // Use unified handler
                    className={`w-full p-3 border ${errors.password || errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none pr-10`} // Added pr-10 for icon
                    placeholder="Enter your password"
                    required
                 />
                 <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-sky-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                 >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
              {/* Real-time password requirements */}
              {password && (
                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center">
                    {hasMinLength(password) ? (
                      <Check className="text-green-500 h-3 w-3 mr-1.5 flex-shrink-0" />
                    ) : (
                      <X className="text-red-500 h-3 w-3 mr-1.5 flex-shrink-0" />
                    )}
                    <span className="text-xs text-gray-600">At least 8 characters</span>
                  </div>
                  <div className="flex items-center">
                    {hasNumber(password) ? (
                      <Check className="text-green-500 h-3 w-3 mr-1.5 flex-shrink-0" />
                    ) : (
                      <X className="text-red-500 h-3 w-3 mr-1.5 flex-shrink-0" />
                    )}
                    <span className="text-xs text-gray-600">At least one number</span>
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

             {/* Confirm Password */}
             <div>
               <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
               <div className="relative">
                  <input
                     type={showPassword ? 'text' : 'password'}
                     name="confirmPassword" // Add name attribute
                     value={confirmPassword}
                     onChange={handleInputChange} // Use unified handler
                     className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none`} // Added pr-10 for icon
                     placeholder="Confirm your password"
                     required
                  />
               </div>
               {/* Real-time password matching feedback */}
               {(password && confirmPassword) && (
                 <div className="mt-1">
                   <div className="flex items-center">
                     {passwordsMatch() ? (
                       <Check className="text-green-500 h-3 w-3 mr-1.5 flex-shrink-0" />
                     ) : (
                       <X className="text-red-500 h-3 w-3 mr-1.5 flex-shrink-0" />
                     )}
                     <span className={`text-xs ${passwordsMatch() ? 'text-gray-600' : 'text-red-500'}`}>
                       Passwords {passwordsMatch() ? 'match' : 'do not match'}
                     </span>
                   </div>
                 </div>
               )}
               {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
             </div>

            {/* General API Error Display */}
            {errors.api && (
              <div className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-md">{errors.api}</div>
            )}

            {/* Submit Button with Loading State */}
            <button
              type="submit"
              disabled={isCheckingEmail || isSubmitting} // Disable button during loading states
              className={`w-full p-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition ${isCheckingEmail || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCheckingEmail ? 'Checking Email...' : isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* Success Message */}
            {added && (
              <div className="text-green-600 text-sm text-center">
                Account created successfully! Redirecting...
              </div>
            )}

          </form>

          {/* Google Sign Up */}
           <div className="mt-6">
             <hr className="mb-4 border-t border-gray-300" />
             <div className="text-center text-sm text-gray-500 mb-2">Or sign up with</div>
             <button
                 type="button"
                 onClick={handleGoogleRegister}
                 className="w-full p-3 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                 aria-label="Sign up with Google"
             >
                 <img src="/google_logo.png" alt="Google logo" className="h-5 w-5" /> {/* Use img tag */}
                 Google
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;