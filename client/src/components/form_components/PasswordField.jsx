import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const PasswordField = ({
  label,
  name,
  id,
  placeholder,
  icon: Icon,
  error,
  value,
  onChange,
  required,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-primary-text dark:text-gray-light1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`
                flex items-center border p-2 rounded-md dark:bg-[#6f6f6f4b]
                ${error ? "border-red-500" : "border-gray-300 dark:border-none"}
                ${
                  error
                    ? "focus-within:border-red-500"
                    : "focus-within:border-sky"
                }
                transition-all duration-200
            `}
      >
        <Icon className="h-5 w-5 text-gray-400 dark:text-gray-light2" />

        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`
                        w-full outline-none border-none bg-transparent
                        ${Icon ? "pl-3" : "pl-0"}
                        transition-all duration-200 dark:text-white
                        text-md placeholder:text-sm dark:placeholder:text-gray-light2
                        ${className}
                    `}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          {showPassword ? (
            <FaEye className="h-5 w-5 dark:text-gray-light2" />
          ) : (
            <FaEyeSlash className="h-5 w-5 dark:text-gray-light2" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
