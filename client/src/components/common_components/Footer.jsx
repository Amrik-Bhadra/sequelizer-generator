import React from "react";

const Footer = () => {
  return (
    <footer className="max-h-fit h-full w-full bg-dark-bg dark:bg-dark-sec-bg text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-gray-light1 text-sm">
        © {new Date().getFullYear()} Sequelizer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
