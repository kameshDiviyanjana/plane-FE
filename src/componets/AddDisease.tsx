const FindDisease = () => {
  return (
    <div className="rounded-xl bg-white p-8 shadow-md">

      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Find Disease
      </h1>

      <div className="rounded-lg border-2 border-dashed border-gray-300 p-10 text-center">

        <p className="mb-4 text-gray-600">
          Upload a plant image to detect disease.
        </p>

        <input
          type="file"
          accept="image/*"
          className="mx-auto block"
        />

      </div>

      <button
        className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
      >
        Predict Disease
      </button>

    </div>
  );
};

export default FindDisease;