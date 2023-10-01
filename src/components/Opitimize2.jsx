/* eslint-disable */
import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const thingsToFix = [
  {
    headline: "Video Chapters",
    content:
      "We couldn't detect any chapters for your video. <br/> To create chapters add a list of timestamps to your description in the following format:",
    tipHeadline: "What are YouTube Chapters?",
    tipContent:
      "Chapters break up your YouTube video into sections. Video Chapters are automatically generated based on timestamps you enter in the video description and will show in the video progress bar (aka the 'video scrubber bar') below your video.",
  },
  {
    headline: "Another Section",
    content: "This is another section with its own content.",
    tipHeadline: "Another Tip",
    tipContent: "More information about this section.",
  },
];

function YourComponent() {
  const [accordionState, setAccordionState] = useState(
    Array(thingsToFix.length).fill(false),
  );

  const toggleAccordion = (index) => {
    const newState = [...accordionState];
    newState[index] = !newState[index];
    setAccordionState(newState);
  };

  return (
    <div className="mb-4">
      <h4 className="font-semibold">Things to Fix</h4>

      {thingsToFix.map((section, index) => (
        <div key={index} className="border rounded mt-2 shadow">
          <button
            className="w-full text-left p-3 border-b flex items-center justify-between focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            {section.headline}
            {accordionState[index] ? (
              <FaChevronUp size={10} />
            ) : (
              <FaChevronDown size={10} />
            )}
          </button>
          {accordionState[index] && (
            <div className="p-3">
              <p dangerouslySetInnerHTML={{ __html: section.content }}></p>
              <div className="text-sm text-gray-500">
                <div className="text-left flex items-center justify-between focus:outline-none border-b pb-3">
                  <div className="flex justify-center items-center">
                    <span className="mr-3">{section.tipHeadline}</span>
                    {accordionState[index] ? (
                      <FaChevronUp color="gray" size={10} />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  <div className="underline">Ignore this</div>
                </div>
                {accordionState[index] && (
                  <div className="mt-3">{section.tipContent}</div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default YourComponent;
