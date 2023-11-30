import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="py-5" style={{ backgroundColor: "#F1F1FA" }}>
      <p className="dark:text-gray-200 text-gray-700 text-right mr-20 text-xs">
        © {currentYear} All rights reserved by SupremeWeb
      </p>
    </div>
  );
};

export default Footer;
