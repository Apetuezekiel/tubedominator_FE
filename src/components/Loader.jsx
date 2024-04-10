import React, { useState, useEffect } from "react";
import { BiLoaderCircle } from "react-icons/bi";

const Loader = ({
  messages,
  message,
  size,
  iconColor,
  messageColor,
  marginTop,
  messageSize,
  marginBottom,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let intervalId;

    if (Array.isArray(messages) && messages.length > 1) {
      intervalId = setInterval(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % messages.length,
        );
      }, 180000);
    }

    return () => clearInterval(intervalId);
  }, [messages]);

  return (
    <div
      className={`flex flex-col items-center justify-center w-full mt-${
        marginTop || 20
      } mb-${marginBottom || 10} animate-pulse`}
    >
      <BiLoaderCircle
        className="animate-spin text-center"
        color={`${iconColor || "#7352FF"}`}
        size={size || 20}
      />
      <div
        className={`${messageSize || "text-xs"} whitespace-normal`}
        style={{ color: messageColor || "black" }}
      >
        {message
          ? message
          : messages && messages.length > 0
          ? messages[currentMessageIndex]
          : "Hold tight while we load up Insights."}
      </div>
    </div>
  );
};

export default Loader;
