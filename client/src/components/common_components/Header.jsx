import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { getInitials } from "../../utils/helperFunctions";
import { MdLogout } from "react-icons/md";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { useNavigate } from "react-router-dom";

const Header = ({ email, name, logout }) => {
  const [option, setOption] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="max-h-fit h-full w-full flex items-center justify-center bg-white dark:bg-dark-sec-bg px-6 py-4 shadow-sm">
      <nav className="max-w-7xl w-full flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-bold text-[#333] dark:text-gray-light1">
            Sequelizer
          </h1>
        </Link>

        <div className="relative flex gap-4">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-semibold">
              {getInitials(name)}
            </span>
            <div className="hidden sm:flex flex-col">
              <p className="font-semibold text-[#333] dark:text-gray-light2 text-sm">
                {name || "John Doe"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-dark1">
                {email || "john.doe@example.com"}
              </p>
            </div>
            <button
              className="dark:text-white"
              onClick={() => setOption(!option)}
            >
              {option ? <FaCaretUp /> : <FaCaretDown />}
            </button>
          </div>

          {option && (
            <div className="absolute -bottom-[7.8rem] right-0 w-full bg-white dark:bg-dark-ter-bg border dark:border dark:border-[#484848] rounded-md shadow-lg z-50 p-3 flex flex-col gap-y-3">
              <ThemeButton />

              <SolidIconBtn
                icon={MdLogout}
                text="Logout"
                className="bg-primary hover:bg-blue-700"
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
