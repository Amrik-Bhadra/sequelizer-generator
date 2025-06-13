import React from 'react';

const InputField = ({
    label,
    type,
    name,
    id,
    placeholder,
    icon: Icon,
    error,
    value,
    onChange,
    required,
    className = '',
}) => {
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

            <div className={`
                flex items-center border p-2 rounded-md dark:bg-[#6f6f6f4b]
                ${error ? 'border-red-500' : 'border-gray-300 dark:border-none'}
                ${error ? 'focus-within:border-red-500' : 'focus-within:border-sky'}
                transition-all duration-200
            `}>
                {Icon && <Icon className="h-5 w-5 text-gray-400 dark:text-gray-light2" />}

                <input
                    type={type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        if (typeof onChange === 'function') {
                        if (typeof e === 'object' && e.target) {
                            onChange(e.target.value);
                        } else {
                            onChange(e);
                        }
                        }
                    }}
                    required={required}
                    className={`
                        w-full outline-none border-none bg-transparent
                        ${Icon ? 'pl-3' : 'pl-0'}
                        transition-all duration-200 dark:text-white
                        text-md placeholder:text-sm dark:placeholder:text-gray-light2
                        ${className}
                    `}
                    />
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
};

export default InputField;