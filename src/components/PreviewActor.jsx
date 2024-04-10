import React from "react";

const PreviewActor = ({ setShowPanel, actorPreviewUrl }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 9999 }}
    >
      <div className="bg-black w-2/6 p-5 rounded-md">
        <div className="flex justify-between">
          <div></div>
          <span
            className="text-right text-xs rounded-full h-5 w-5 mb-5 flex justify-end m-auto cursor-pointer"
            style={{
              background:
                "linear-gradient(210.54deg, #9999FF 7.79%, #4B49AC 92.58%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setShowPanel(false);
            }}
          >
            X
          </span>
        </div>
        <div className="text-xs text-white text-center mb-3">
          Note: Actors previews are always in English. The output video will be
          in the Language you choose
        </div>
        <video className="rounded" controls style={{ maxWidth: "100%" }}>
          <source src={actorPreviewUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default PreviewActor;
