import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-sm">
        © {new Date().getFullYear()} Sequelizer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
