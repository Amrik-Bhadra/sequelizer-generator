import React from 'react';

const SolidIconBtn = ({ icon: Icon, text, onClick, className = "", type = "button", disabled }) => {
const SolidIconBtn = ({ icon: Icon, text, onClick, className = "", type = "button", disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition duration-200 ${className}`}
    >
      {Icon && <Icon className="text-lg font-semibold" />}
      <span className='font-semibold'>{text}</span>
    </button>
  );
};

export default SolidIconBtn;