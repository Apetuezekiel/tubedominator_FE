import React, { useState } from "react";
import Loader from "./Loader";

const LoaderPanel = ({ message }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 9999 }}
    >
      <div className="bg-white w-2/6 p-5 rounded-md">
        <Loader message={`${message}`} />
      </div>
    </div>
  );
};

export default LoaderPanel;
