const RegistrationStage1 = ({ formData, onChange, onNext }) => {
  const handleNext = () => {
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center h-1/2 bg-gradient-to-b from-blue-400 bg-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          {/* <h2 className="text-2xl font-semibold mb-4">Registration Stage 1: Channel Name</h2> */}
          <div className="mb-4">
            <label className="block text-gray-600">Enter Channel Name</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:bg-purple-600"
              placeholder="Channel Name"
              value={formData.channelName}
              onChange={(e) => onChange("channelName", e.target.value)}
            />
          </div>
          <button
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-600 focus:outline-none"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStage1;
