import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Briefcase,
  User,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { registerUser } from "../utils/api.js";
import { FormInput } from "../components/ui/FormInput";
import { PasswordInput } from "../components/ui/PasswordInput";
import { LoadingButton } from "../components/ui/LoadingButton";
import { Alert } from "../components/ui/Alert";

const backgroundImage =
  "https://cdn.prod.website-files.com/66e5292bfdb35c76b373b99c/66e5292bfdb35c76b373bb1a_img_sundays_0002.webp";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);
  const [screenSize, setScreenSize] = useState("desktop");

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check screen size and update state
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Check if form is complete for step navigation
    if (currentStep === 1) {
      setFormComplete(
        formData.name.trim().length >= 2 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      );
    } else if (currentStep === 2) {
      setFormComplete(
        formData.password.length >= 8 &&
          formData.confirmPassword === formData.password &&
          passwordStrength >= 60
      );
    }
  }, [formData, currentStep, passwordStrength]);

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

  const getStrengthText = () => {
    if (passwordStrength <= 40) return "Weak";
    if (passwordStrength <= 70) return "Good";
    return "Strong";
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

  const handleStepChange = (nextStep) => {
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setAnimateIn(true);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (formData.name.trim().length < 2)
        throw new Error("Name must be at least 2 characters long");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        throw new Error("Please enter a valid email address");
      if (formData.password !== formData.confirmPassword)
        throw new Error("Passwords do not match");
      if (passwordStrength < 60)
        throw new Error("Please create a stronger password");

      const { token, user } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      login(user, token);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/events"), 1200);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Registration failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordTips = () => (
    <div
      className={`absolute z-20 top-full left-0 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-md w-full ${
        screenSize === "mobile" ? "text-xs" : "text-sm"
      }`}
    >
      <p
        className={`${
          screenSize === "mobile" ? "text-xs" : "text-sm"
        } font-medium mb-2 text-gray-800`}
      >
        Password must contain:
      </p>
      <ul
        className={`space-y-1 ${
          screenSize === "mobile" ? "text-xs" : "text-sm"
        } text-gray-600`}
      >
        {Object.entries(passwordValidation).map(([key, value]) => (
          <li key={key} className="flex items-center">
            {value ? (
              <CheckCircle
                className="mr-2 text-green-500"
                size={screenSize === "mobile" ? 14 : 16}
              />
            ) : (
              <AlertCircle
                className="mr-2 text-gray-400"
                size={screenSize === "mobile" ? 14 : 16}
              />
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

  const RoleSelector = () => (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        onClick={() => setFormData({ ...formData, role: "Attandee" })}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
          formData.role === "Attandee"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-300"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`p-3 rounded-full mb-2 ${
              formData.role === "Attandee" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <User
              className={`${
                formData.role === "Attandee" ? "text-blue-600" : "text-gray-600"
              }`}
              size={24}
            />
          </div>
          <h3 className="font-medium text-gray-900">Attendee</h3>
          <p
            className={`${
              screenSize === "mobile" ? "text-xs" : "text-sm"
            } text-gray-500 mt-1`}
          >
            Browse and attend events
          </p>
        </div>
      </div>

      <div
        onClick={() => setFormData({ ...formData, role: "Organizer" })}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
          formData.role === "Organizer"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-300"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`p-3 rounded-full mb-2 ${
              formData.role === "Organizer" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <Briefcase
              className={`${
                formData.role === "Organizer"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
              size={24}
            />
          </div>
          <h3 className="font-medium text-gray-900">Organizer</h3>
          <p
            className={`${
              screenSize === "mobile" ? "text-xs" : "text-sm"
            } text-gray-500 mt-1`}
          >
            Create and manage events
          </p>
          {formData.role === "Organizer" && (
            <span className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              Pro
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Determine ticket stub size based on screen
  const ticketStubWidth = screenSize === "mobile" ? "w-8" : "w-12";
  const ticketStubFontSize = screenSize === "mobile" ? "text-sm" : "text-lg";
  const mainContainerMargin = screenSize === "mobile" ? "ml-8" : "ml-12";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-2 sm:px-4 py-6 sm:py-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="w-full max-w-md relative">
        {/* Ticket Stub - responsive */}
        <div
          className={`absolute left-0 top-0 h-full ${ticketStubWidth} bg-gradient-to-r from-blue-600 to-blue-500 rounded-l-2xl overflow-hidden`}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            {[...Array(screenSize === "mobile" ? 8 : 15)].map((_, i) => (
              <div
                key={i}
                className="absolute h-3 w-3 rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                }}
              ></div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-white font-bold ${ticketStubFontSize} tracking-widest transform -rotate-90 whitespace-nowrap font-serif`}
            >
              {screenSize === "mobile" ? "EVT" : "EVENTIFY"}
            </span>
          </div>
          {/* Perforated edge - hide on smaller screens */}
          {screenSize !== "mobile" && (
            <div className="absolute right-0 top-0 h-full w-2">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full my-8"
                ></div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 rounded-r-2xl shadow-2xl ${mainContainerMargin} relative overflow-hidden`}
        >
          {/* Background decoration - adjust size for mobile */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-blue-100 -mr-12 -mt-12 opacity-50"></div>
          <div className="absolute -bottom-16 -left-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-blue-100 -mr-12 -mt-12 opacity-50"></div>
          {/* <div className="absolute bottom-0 left-6 sm:left-8 w- sm:w-64 h-24 sm:h-32 bg-gradient-to-t from-blue-50 to-transparent"></div> */}

          {/* Progress indicator */}
          <div className="absolute top-3 right-3 flex gap-1">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-6 sm:w-8 h-1 rounded-full ${
                  step < currentStep
                    ? "bg-blue-600"
                    : step === currentStep
                    ? "bg-blue-400"
                    : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>

          {/* Header - responsive font sizes */}
          <div className="text-center mb-4 sm:mb-6 relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <UserPlus
                className="text-blue-600"
                size={screenSize === "mobile" ? 22 : 28}
              />
              {currentStep === 1 && "Get Started"}
              {currentStep === 2 && "Secure Account"}
              {currentStep === 3 && "Final Details"}
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
              {currentStep === 1 && "Create your Eventify account"}
              {currentStep === 2 && "Create a strong password"}
              {currentStep === 3 && "Choose your account type"}
            </p>
          </div>

          {/* Alerts - make them responsive */}
          {(error || success) && (
            <Alert
              type={error ? "error" : "success"}
              message={error || success}
              className={screenSize === "mobile" ? "text-xs py-2" : ""}
            />
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <div
              className={`transition-all duration-300 transform ${
                animateIn
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
            >
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="form-group">
                    <FormInput
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      icon={UserPlus}
                      className="w-full"
                    />
                  </div>

                  <div className="form-group">
                    <FormInput
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      icon={Mail}
                      className="w-full"
                    />
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <button
                      type="button"
                      disabled={!formComplete}
                      onClick={() => handleStepChange(2)}
                      className={`w-full flex items-center justify-center bg-blue-600 ${
                        formComplete ? "hover:bg-blue-700" : "opacity-60"
                      } text-white font-medium py-2 sm:py-2.5 rounded-md transition-colors text-sm sm:text-base`}
                    >
                      <span>Continue</span>
                      <ChevronRight
                        size={screenSize === "mobile" ? 16 : 18}
                        className="ml-1"
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="form-group relative">
                    <div className="relative">
                      <PasswordInput
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        onFocus={() => setShowPasswordTips(true)}
                        onBlur={() =>
                          setTimeout(() => setShowPasswordTips(false), 100)
                        }
                        className="w-full"
                      />
                      {formData.password && (
                        <div className="mt-2 flex items-center">
                          <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength <= 40
                                ? "text-red-500"
                                : passwordStrength <= 70
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {getStrengthText()}
                          </span>
                        </div>
                      )}
                    </div>
                    {showPasswordTips && (
                      <div className="h-0 relative">
                        <PasswordTips />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <PasswordInput
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full"
                    />
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <XCircle size={14} className="mr-1" /> Passwords don't
                          match
                        </p>
                      )}
                  </div>

                  <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => handleStepChange(1)}
                      className="p-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      {screenSize === "mobile" ? (
                        <ArrowLeft size={16} />
                      ) : (
                        "Back"
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={!formComplete}
                      onClick={() => handleStepChange(3)}
                      className={`flex-1 flex items-center justify-center bg-blue-600 ${
                        formComplete ? "hover:bg-blue-700" : "opacity-60"
                      } text-white font-medium py-2 sm:py-2.5 rounded-md transition-colors text-sm sm:text-base`}
                    >
                      <span>Continue</span>
                      <ChevronRight
                        size={screenSize === "mobile" ? 16 : 18}
                        className="ml-1"
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Role Selection */}
              {currentStep === 3 && (
                <div className="space-y-3 sm:space-y-4">
                  <RoleSelector />

                  <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => handleStepChange(2)}
                      className="p-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      {screenSize === "mobile" ? (
                        <ArrowLeft size={16} />
                      ) : (
                        "Back"
                      )}
                    </button>
                    <LoadingButton
                      type="submit"
                      isLoading={isLoading}
                      loadingText="Creating..."
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-2.5 rounded-md transition-colors text-sm sm:text-base"
                    >
                      {screenSize === "mobile"
                        ? "Complete"
                        : "Complete Registration"}
                    </LoadingButton>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
