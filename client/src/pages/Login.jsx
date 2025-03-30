import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/api";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { FormInput } from "../components/ui/FormInput";
import { PasswordInput } from "../components/ui/PasswordInput";
import { LoadingButton } from "../components/ui/LoadingButton";
import { Alert } from "../components/ui/Alert";
import AnimatedTooltip from "../components/ui/AnimatedTooltip"; // Import the reusable component

// Data for the avatars
const people = [
  {
    id: 1,
    name: "John Doe",
    // designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    // designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    // designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    // designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }
      if (formData.password.length < 1) {
        throw new Error("Password is required");
      }
      const { token, user } = await loginUser(formData);
      login(user, token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/events"), 500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Login failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="relative py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-blue-600 opacity-5 rounded-full scale-150 -translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute inset-0 bg-eventify-500 opacity-5 rounded-full scale-150 translate-x-1/3 translate-y-1/4"></div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Section */}
            <div className="lg:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-blue-500">
                Manage Events{" "}
                <span className="text-gray-800">Like Never Before</span>
              </h1>
              <p className="text-xl max-w-2xl text-gray-500">
                Streamline your event management process with our comprehensive
                platform designed for professionals.
              </p>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Get Started Button */}
                <Link to="/register">
                  <button className="group relative w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-lg font-medium rounded-lg transition-all duration-300 shadow-md overflow-hidden text-white bg-blue-500">
                    <span className="absolute inset-0 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span className="relative flex items-center justify-center">
                      Get Started
                      <ArrowRight className="ml-2 inline-block transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>

                {/* Watch Demo Button */}
                <button className="group relative w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-lg font-medium rounded-lg transition-all duration-300 shadow-md border border-blue-500 text-blue-500 overflow-hidden">
                  <span className="absolute inset-0 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="relative group-hover:text-white transition-colors duration-300">
                    Watch Demo
                  </span>
                </button>
              </div>

              {/* Trusted By Section */}
              <div className="pt-14 flex flex-col sm:flex-row items-center gap-4">
                <p className="text-sm font-medium text-gray-500">Trusted by:</p>
                <div className="flex items-center">
                  <AnimatedTooltip items={people} />
                </div>
              </div>
            </div>
            {/* Right Section (Login Form) */}
            <div className="w-full max-w-[95vw] sm:max-w-md">
              <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 md:px-10 shadow-2xl rounded-3xl relative">
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center flex-wrap gap-2 sm:gap-3 text-gray-800">
                    <Lock className="text-blue-500" size={28} />
                    Sign In to Eventify
                  </h2>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                    Access your account and enjoy event experiences
                  </p>
                </div>
                {/* Alerts */}
                {(error || success) && (
                  <Alert
                    type={error ? "error" : "success"}
                    message={error || success}
                    className={`${
                      error ? "bg-red-500" : "bg-green-500"
                    } text-white`}
                  />
                )}
                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 sm:space-y-4"
                >
                  <FormInput
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    icon={Mail}
                  />
                  <PasswordInput
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <LoadingButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Logging in..."
                    className="bg-blue-500 text-white"
                  >
                    Sign In
                  </LoadingButton>
                </form>
                {/* Register Link */}
                <div className="mt-3 sm:mt-4 text-center">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-blue-500">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
