import React from "react";

const Header = ({ category, size, title, mt }) => (
  <div className={`mt-${mt || "10"} mb-5`}>
    <p className="text-lg text-gray-400">{category}</p>
    <p className={`${size} font-extrabold tracking-tight text-slate-900`}>
      {title}
    </p>
  </div>
);

export default Header;
