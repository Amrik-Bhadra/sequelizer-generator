import React from "react";

const DropdownComponent = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  required,
  placeholder,
}) => {
  // Sort options alphabetically
  const sortedOptions = options.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-primary-text dark:text-gray-light1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className={`relative`}>
        <select
          name={name}
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={
            `w-full border rounded-md p-2 bg-white dark:bg-[#6f6f6f4b] text-sm dark:text-gray-light1 text-gray-700 dark:border-none
            focus:ring-sky focus:border-sky outline-none transition-all`
          }
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {sortedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownComponent;
