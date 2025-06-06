import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Header = () => {
  const [option, setOption] = useState(false);
  return (
    <header className="w-full bg-white px-6 py-4 shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-bold text-gray-800">Sequelizer</h1>
        </Link>

        <div className="relative flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="h-11 w-11 bg-primary text-white rounded-full flex items-center justify-center text-lg font-semibold">
              AB
            </span>
            <div className="hidden sm:flex flex-col">
              <p className="font-semibold text-gray-800 text-base">
                Amrik Bhadra
              </p>
              <p className="text-sm text-gray-500">amrik.bhadra@gmail.com</p>
            </div>
            <button onClick={() => setOption(!option)}>
              {option ? <FaCaretUp /> : <FaCaretDown />}
            </button>
          </div>

          {option && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 p-3">
              <ThemeButton />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
