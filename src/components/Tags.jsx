import React, { useState } from "react";

const Tags = ({ items, ml = "ml-10", onClick, initialShow = 3 }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedItems = showAll ? items : items.slice(0, initialShow);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={`flex flex-wrap ${ml}`}>
      {displayedItems.map((item, index) => (
        <div key={index} className="m-2 flex" onClick={() => onClick(item)}>
          <div
            className={`rounded-tl-md rounded-bl-md bg-gray-200 p-2 ${onClick ? 'cursor-pointer' : ''}`}
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
      {items.length > initialShow && (
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
