import React from "react";

export const Button = ({ 
  type = "button", 
  onClick, 
  disabled = false, 
  isLoading = false, 
  loadingText = "Loading...", 
  children,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full flex justify-center items-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform active:scale-95 disabled:scale-100 ${className}`}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};