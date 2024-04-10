import React from "react";

const UserConsentPanel = ({
  setShowUserConsentPanel,
  formData,
  setFormData,
}) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 9999 }}
    >
      <div className="bg-white w-2/6 p-5 rounded-md text-xs">
        <div className="flex justify-between">
          <div></div>
          <span
            className="text-right text-xs rounded-full h-5 w-5 flex justify-end m-auto cursor-pointer"
            style={{
              background:
                "linear-gradient(210.54deg, #9999FF 7.79%, #4B49AC 92.58%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setShowUserConsentPanel(false);
            }}
          >
            X
          </span>
        </div>
        <div className="mt-5 text-center">
          Before proceeding with the account creation process, Tubedominator
          seeks your explicit consent to utilize AI models for enhancing your
          experience. This involves analyzing the search keywords you provide to
          generate personalized recommendations. This consent is crucial for
          tailoring our services to your preferences. By agreeing, you allow us
          to use this data for optimizing your content strategy and providing
          valuable insights.
          <br />
          <br />
          To learn more you can read our
          <a
            className="underline text-blue-800 ml-1"
            href={`${process.env.REACT_APP_BASE_URL}/privacy-policy`}
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy policy
          </a>
        </div>
        <div className="flex justify-center items-center mt-5">
          <button
            className={`text-white rounded-full px-4 py-2 ml-4 text-xs flex items-center`}
            onClick={() => {
              setFormData({
                ...formData,
                agreeToTerms: false,
              });
              setShowUserConsentPanel(false);
            }}
            style={{
              background:
                "linear-gradient(270deg, #FF8986 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
              color: "white",
            }}
          >
            I disagree{" "}
          </button>
          <button
            className={`text-white rounded-full px-4 py-2 ml-4 text-xs flex items-center`}
            onClick={() => {
              setFormData({
                ...formData,
                agreeToTerms: true,
              });
              setShowUserConsentPanel(false);
            }}
            style={{
              background:
                "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
              color: "white",
            }}
          >
            I agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserConsentPanel;
