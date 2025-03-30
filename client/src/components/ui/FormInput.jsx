import React from "react";

export const FormInput = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  rightElement,
  onFocus,
  onBlur,
}) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <Icon className="text-gray-400" size={16} />
        </div>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`block w-full ${
          Icon ? "pl-8 sm:pl-10" : "pl-2 sm:pl-3"
        } ${
          rightElement ? "pr-8 sm:pr-12" : "pr-2 sm:pr-3"
        } py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm sm:text-base bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        required={required}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center gap-1 sm:gap-2">
          {rightElement}
        </div>
      )}
    </div>
  );
};
