import React from "react";

const RegistrationStage3 = ({ formData, onChange, onNext, onBack }) => {
  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-FAFBFB flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* <h2 className="text-2xl font-semibold mb-4">Registration Stage 3: Terms, Language, and Competitors</h2> */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={formData.acceptTerms}
              onChange={(e) => onChange("acceptTerms", e.target.checked)}
            />
            Accept Terms and Conditions
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">
            Enter Channel Language
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Channel Language"
            value={formData.channelLanguage}
            onChange={(e) => onChange("channelLanguage", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">
            Enter Competitive Channels
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Competitive Channels"
            value={formData.competitiveChannels}
            onChange={(e) => onChange("competitiveChannels", e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-9750E1 focus:outline-none"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-9750E1 focus:outline-none"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStage3;
