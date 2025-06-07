import React from 'react';

const SolidIconBtn = ({ icon: Icon, text, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md transition duration-200 ${className}`}
    >
      {Icon && <Icon className="text-lg font-semibold" />}
      <span className='font-semibold'>{text}</span>
    </button>
  );
};

export default SolidIconBtn;
