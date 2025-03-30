import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { FormInput } from "./FormInput";

export const PasswordInput = ({
  name = "password",
  placeholder = "Password",
  value,
  onChange,
  required = true,
  onFocus,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormInput
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      icon={Lock}
      onFocus={onFocus}
      onBlur={onBlur}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
};