import React, { useRef } from "react";

const Testss = () => {
  const firstElementRef = useRef(null);
  const secondElementRef = useRef(null);

  const handleFirstElementClick = () => {
    // Simulate a click on the second element
    secondElementRef.current.click();
  };

  return (
    <div>
      <button ref={firstElementRef} onClick={handleFirstElementClick}>
        First Element
      </button>
      <button
        ref={secondElementRef}
        onClick={() => console.log("Second Element clicked")}
      >
        Second Element
      </button>
    </div>
  );
};

export default Testss;
