import React from 'react';

const SolidIconBtn = ({ icon: Icon, text, onClick, className = "", type = "button", disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
<<<<<<< HEAD
      disabled={disabled}
=======
>>>>>>> 861e0e76873823dcac024bbcf0113c7cb8b277a9
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition duration-200 ${className}`}
    >
      {Icon && <Icon className="text-lg font-semibold" />}
      <span className='font-semibold'>{text}</span>
    </button>
  );
};

export default SolidIconBtn;