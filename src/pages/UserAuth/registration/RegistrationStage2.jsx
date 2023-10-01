/* eslint-disable */
const RegistrationStage2 = ({ formData, onChange, onNext, onBack }) => {
  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-fafbfd flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* <h2 className="text-2xl font-semibold mb-4">Registration Stage 2: Description and Email</h2> */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Enter Description</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            rows="4"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">
            Enter Business Email
          </label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Business Email"
            value={formData.businessEmail}
            onChange={(e) => onChange("businessEmail", e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-9750e1 focus:outline-none"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className=" bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-9750e1 focus:outline-none"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStage2;
