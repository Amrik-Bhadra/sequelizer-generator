import React from 'react';

const HollowIconButton = ({
  icon: Icon,
  text,
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2
        px-4 py-2
        border border-primary text-primary
        rounded-md
        transition duration-200
        hover:bg-primary/10
        ${className}
      `}
    >
      {Icon && <Icon className="text-lg font-semibold" />}
      <span className='font-semibold'>{text}</span>
    </button>
  );
};

export default HollowIconButton;
