import React from "react";

const CubeLoader = () => {
  return (
    <div className="w-20 h-20 relative">
      <div className="absolute top-0 w-10 h-10 bg-blue-500 rounded animate-bounce" />
      <div
        className="absolute top-0 w-10 h-10 bg-blue-500 rounded animate-bounce"
        style={{ animationDelay: "0.1s" }}
      />
      <div
        className="absolute top-0 w-10 h-10 bg-blue-500 rounded animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
    </div>
  );
};

export default CubeLoader;
