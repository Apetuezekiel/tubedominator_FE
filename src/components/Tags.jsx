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
        <div key={index} className="m-2">
          <div className="flex rounded-full bg-gray-200 p-2">
            <div className="bg-gray-300 rounded-full px-3 py-1 text-xs">
              {item}
            </div>
          </div>
        </div>
      ))}
      {items.length > 3 && (
        <button
          className="mt-2 ml-2 cursor-pointer text-xs underline"
          onClick={handleToggle}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default Tags;
