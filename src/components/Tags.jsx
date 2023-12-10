import React, { useState } from "react";

const Tags = ({ items, ml }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedItems = showAll ? items : items.slice(0, 3);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={`flex flex-wrap ${ml ?? "ml-10"}`}>
      {displayedItems.map((item, index) => (
        <div key={index} className="m-2 flex">
          <div
            className="rounded-tl-md rounded-bl-md bg-gray-200 p-2"
            style={{ backgroundColor: "#EAEAF5" }}
          >
            <div className="px-3 py-1 text-xs">{item}</div>
          </div>
          <div
            className="bg-gray-400 rounded-full px-1 py-1 text-xs transform translate-x-[-6px]"
            style={{ backgroundColor: "#D7D7F7" }}
          ></div>
        </div>
      ))}
      {items.length > 3 && (
        <button
          className="mt-2 ml-2 cursor-pointer text-xs underline"
          onClick={handleToggle}
          style={{ color: "#9999FF" }}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default Tags;
