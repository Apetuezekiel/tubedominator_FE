/* eslint-disable */
import React from "react";

function Training() {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-md overflow-hidden min-h-screen">
      <div className="">
        <div className="pageTitle text-3xl font-semibold">TRAINING VIDEOS</div>
        <div className="tag text-md mt-2 text-xs font-thin">
          {/* Update your Profile Details */}
        </div>
      </div>
      <div
        className="text-lg flex-wrap flex items-center gap-10 mt-10"
        style={{ lineHeight: "50px" }}
      >
        <div
          className="text-lg flex-wrap flex items-center gap-10 mt-10"
          style={{ lineHeight: "50px" }}
        >
          <div>
            <div className="text-sm mb-[-10] font-semibold">
              1. Dashboard Overview
            </div>
            <div>
              <iframe
                src="https://player.vimeo.com/video/893652426?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                // style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title="TubeDominator Dashboard Overview"
              ></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
          </div>

          <div>
            <div className="text-sm mb-3 font-semibold">
              2. Idea Research and Save Ideas
            </div>
            <div>
              <iframe
                src="https://player.vimeo.com/video/893658669?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                // style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title="TubeDominator Ideation Research And Save Ideas"
              ></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
          </div>

          <div>
            <div className="text-sm mb-3 font-semibold">
              3. Keyword Menu Function
            </div>
            <div>
              <iframe
                src="https://player.vimeo.com/video/893670793?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                // style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title="Keyword Menu Function"
              ></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
          </div>

          <div>
            <div className="text-sm mb-3 font-semibold">
              4. TubeDominator Optimization Function
            </div>
            <div>
              <iframe
                src="https://player.vimeo.com/video/893675281?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="TubeDominator Optimization Function"
              ></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
          </div>

          <div>
            <div className="text-sm mb-3 font-semibold">
              5. AI Post Generator
            </div>
            <div>
              <iframe
                src="https://player.vimeo.com/video/893683432?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="TubeDominator AI Post Generator"
              ></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
          </div>
        </div>

        {/* Repeat the same structure for other videos */}
      </div>
    </div>
  );
}

export default Training;
