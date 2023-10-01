import React, { useState } from "react";
import RegistrationStage1 from "./RegistrationStage1";
import RegistrationStage2 from "./RegistrationStage2";
import RegistrationStage3 from "./RegistrationStage3";
import RegistrationStage4 from "./RegistrationStage4";

const RegistrationForm = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    channelName: "",
    description: "",
    businessEmail: "",
    acceptTerms: false,
    channelLanguage: "",
    competitiveChannels: "",
    keywords: "",
    password: "",
  });

  const handleNext = () => {
    setCurrentStage(currentStage + 1);
  };

  const handleBack = () => {
    setCurrentStage(currentStage - 1);
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <RegistrationStage1
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <RegistrationStage2
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <RegistrationStage3
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <RegistrationStage4
            formData={formData}
            onChange={handleChange}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    // Perform registration logic, e.g., make API request
    // You can use formData to send registration data to the server
    console.log("Registration submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className=" w-96  p-8">
        {/* <div className="mb-6">
  <div className="flex items-center mb-4">
    <div className="bg-purple-600 rounded-full font-semibold w-8 h-8 flex justify-center items-center text-white">
      1
    </div>
    <div className="ml-2 font-semibold text-gray-800">Step 1</div>
  </div>
  <div className="relative h-4">
    <div className="h-1 bg-purple-600"></div>
    {Array.from({ length: 3 }, (_, index) => (
      <div
        key={index}
        className={`absolute top-0 h-4 w-4 ${
          currentStage >= index + 2 ? 'bg-purple-600' : 'bg-gray-300'
        } rounded-full transform -translate-x-1/2 transition duration-300`}
        style={{ left: `calc(${(index + 1) / 4 * 100}%)` }}
      ></div>
    ))}
  </div>
</div> */}

        {renderStage()}
      </div>
    </div>
  );
};

export default RegistrationForm;
