import React from 'react';

const Dropdown = ({
    label,
    name,
    options,
    selectedValue,
    onChange,
    required,
    placeholder,
}) => {
    // Sort options alphabetically
    const sortedOptions = options.sort((a, b) =>
        a.label.localeCompare(b.label)
    );

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-medium text-primary-text">
                {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className={`relative`}>
                <select
                    name={name}
                    value={selectedValue}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    className={`
                        w-full border rounded-md p-2 bg-white text-sm text-gray-700
                        focus:ring-sky focus:border-sky outline-none transition-all
                    `}
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

export default Dropdown;