import React from "react";

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
        flex items-center justify-center gap-2 px-4 py-2 border text-secondary rounded-md
        transition duration-200 hover:bg-secondary/10 dark:border-none dark:bg-gray-light1 ${className}
      `}
    >
      {Icon && <Icon className="text-lg font-semibold" />}
      <span className="font-semibold">{text}</span>
    </button>
  );
};

export default HollowIconButton;
