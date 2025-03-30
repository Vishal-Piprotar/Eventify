import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail } from "lucide-react";
import { registerUser } from "../utils/api.js";
import { FormInput } from "../components/ui/FormInput";
import { PasswordInput } from "../components/ui/PasswordInput";
import { LoadingButton } from "../components/ui/LoadingButton";
import { Alert } from "../components/ui/Alert";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Attandee",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordTips, setShowPasswordTips] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };

    setPasswordValidation(validations);
    const strength = Object.values(validations).filter(Boolean).length;
    return Math.min(strength * 20, 100);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 40) return "bg-red-500";
    if (passwordStrength <= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Client-side validations
      if (formData.name.trim().length < 2)
        throw new Error("Name must be at least 2 characters long");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        throw new Error("Please enter a valid email address");
      if (formData.password !== formData.confirmPassword)
        throw new Error("Passwords do not match");
      if (passwordStrength < 60)
        throw new Error("Please create a stronger password");

      // Using the imported API function
      const { token, user } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Store user data and token in AuthContext
      login(user, token);

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/events"), 500);
    } catch (err) {
      // Handle axios error structure
      const errorMessage = err.response?.data?.error || err.message || "Registration failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordTips = () => (
    <div className="absolute z-10 mt-2 p-2 sm:p-3 bg-white border border-gray-200 rounded-lg shadow-lg w-full sm:w-64 max-w-[90vw] right-0 sm:right-auto">
      <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
        Password must contain:
      </p>
      <ul className="space-y-1 text-xs sm:text-sm">
        {Object.entries(passwordValidation).map(([key, value]) => (
          <li key={key} className="flex items-center">
            {value ? (
              <span className="text-green-500 mr-1 sm:mr-2">✓</span>
            ) : (
              <span className="text-gray-400 mr-1 sm:mr-2">○</span>
            )}
            <span className={value ? "text-gray-700" : "text-gray-500"}>
              {key === "length"
                ? "8+ characters"
                : `${key.charAt(0).toUpperCase() + key.slice(1)}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[95vw] sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 md:px-10 shadow-2xl rounded-3xl relative">
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center space-x-1 sm:space-x-2">
            {formData.role === "Organizer" && (
              <span className="bg-green-100 text-green-800 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                Pro Account
              </span>
            )}
            {formData.role === "Admin" && (
              <span className="bg-purple-100 text-purple-800 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                Premium Account
              </span>
            )}
          </div>

          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center flex-wrap gap-2 sm:gap-3">
              <UserPlus className="text-blue-500" size={28} />
              Join Eventify
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
              Create your account and unlock event experiences
            </p>
          </div>

          {(error || success) && (
            <Alert 
              type={error ? "error" : "success"} 
              message={error || success} 
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name Input */}
            <FormInput
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              icon={UserPlus}
            />

            {/* Email Input */}
            <FormInput
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              icon={Mail}
            />

            {/* Password Input */}
            <div className="relative">
              <PasswordInput
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handlePasswordChange}
                onFocus={() => setShowPasswordTips(true)}
                onBlur={() => setShowPasswordTips(false)}
              />
              {formData.password && (
                <div className="mt-1">
                  <div className="w-full h-1 bg-gray-200 rounded-full">
                    <div
                      className={`h-0.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
              {showPasswordTips && <PasswordTips />}
            </div>

            {/* Confirm Password Input */}
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {/* Role Selection */}
            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-md text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Attandee">User</option>
                <option value="Organizer">Event Organizer</option>
                <option value="Admin" disabled>Administrator</option>
              </select>
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Sign Up
            </LoadingButton>
          </form>

          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-300"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;