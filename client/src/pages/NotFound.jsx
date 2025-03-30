import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      {/* Main Content */}
      <div className="max-w-md w-full space-y-6">
        {/* Error Code */}
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
          404
        </h1>

        {/* Error Message */}
        <p className="text-2xl font-medium text-gray-800">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-base text-gray-600">
          It seems like you've taken a wrong turn. Let's get you back on track!
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="inline-block w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Home
        </Link>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 bg-red-200 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-200 opacity-30 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default NotFound;