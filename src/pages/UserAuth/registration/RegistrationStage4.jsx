import React from "react";

const RegistrationStage4 = ({ formData, onChange, onBack, onSubmit }) => {
  const handleSubmit = () => {
    onSubmit();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-FAFBFB flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* <h2 className="text-2xl font-semibold mb-4">Registration Stage 4: Keywords and Password</h2> */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">
            Enter Important Keywords
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Important Keywords"
            value={formData.keywords}
            onChange={(e) => onChange("keywords", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Enter Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
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
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStage4;
