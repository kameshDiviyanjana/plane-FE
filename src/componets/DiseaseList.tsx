const DiseaseList = () => {
  const diseases = [
    {
      id: 1,
      name: "Leaf Blight",
      description: "A common fungal disease affecting plant leaves.",
    },
    {
      id: 2,
      name: "Powdery Mildew",
      description: "White powder-like fungal growth on leaves.",
    },
    {
      id: 3,
      name: "Rice Blast",
      description: "A fungal disease affecting rice plants.",
    },
  ];

  return (
    <div>

      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Disease List
      </h1>

      <div className="grid gap-4">

        {diseases.map((disease) => (
          <div
            key={disease.id}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <h2 className="mb-2 text-xl font-bold">
              {disease.name}
            </h2>

            <p className="text-gray-600">
              {disease.description}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default DiseaseList;