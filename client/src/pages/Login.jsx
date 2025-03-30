import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../utils/api.js";
import { Lock, Mail } from 'lucide-react';
import { FormInput } from "../components/ui/FormInput";
import { PasswordInput } from "../components/ui/PasswordInput";
import { LoadingButton } from "../components/ui/LoadingButton";
import { Alert } from "../components/ui/Alert";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      if (formData.password.length < 1) {
        throw new Error('Password is required');
      }
      
      const { token, user } = await loginUser(formData);
      login(user, token);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/events'), 500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[95vw] sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 md:px-10 shadow-2xl rounded-3xl relative">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center flex-wrap gap-2 sm:gap-3">
              <Lock className="text-blue-500" size={28} />
              Sign In to Eventify
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
              Access your account and enjoy event experiences
            </p>
          </div>

          {(error || success) && (
            <Alert 
              type={error ? "error" : "success"} 
              message={error || success} 
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
            <PasswordInput
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              loadingText="Logging in..."
            >
              Sign In
            </LoadingButton>
          </form>

          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-300"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;