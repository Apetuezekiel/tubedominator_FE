/* eslint-disable */

import React from "react";

function Spinner({ width, color }) {
  return (
    <div className="flex justify-center items-center h-8">
      <div
        className={`animate-spin rounded-full h-8 w-${
          width ? width : "8"
        } border-t-4 ${color ? color : "border-purple-500"}`}
      ></div>
    </div>
  );
}

export default Spinner;
