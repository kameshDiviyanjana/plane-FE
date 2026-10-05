import React, { useState } from "react";
import authFetch from "../api/authfetch";

interface PredictionResult {
  id: number;
  plantName: string;
  diseaseName: string;
  confidence: number;
  imageUrl: string | null;
  createdAt: string;
  treatment?: string;
}

const FindDisease = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await authFetch.post<PredictionResult>(
        "/predictions/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Failed to connect to the prediction model. Make sure both Spring Boot and ML services are running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">🔍 Find Disease</h1>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          {previewUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Plant preview"
                className="max-h-64 rounded-md object-contain mb-4 border shadow"
              />
              <p className="text-sm text-green-600 font-medium">
                Selected: {selectedFile?.name}
              </p>
            </div>
          ) : (
            <div className="py-6">
              <div className="text-5xl mb-4">🌱</div>
              <p className="text-gray-600 font-medium mb-1">
                Drag and drop or click to upload a plant image
              </p>
              <p className="text-xs text-gray-400">Supports JPG, PNG, JPEG</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 text-sm bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handlePredict}
            disabled={loading || !selectedFile}
            className={`px-6 py-3 font-semibold text-white rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer ${
              loading || !selectedFile
                ? "bg-gray-400 cursor-not-allowed opacity-75"
                : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Predicting...
              </>
            ) : (
              "Predict Disease"
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded-xl bg-white p-8 shadow-md border-t-4 border-green-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📊 Prediction Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center space-y-4">
              {/* <div>
                <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                  Plant Name
                </span>
                <p className="text-lg font-bold text-gray-800 flex items-center gap-2 mt-1">
                  🌿 {result.plantName}
                </p>
              </div> */}

              <div>
                <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                  Condition / Disease
                </span>
                <p
                  className={`text-lg font-bold mt-1 flex items-center gap-2 ${
                    result.diseaseName.toLowerCase().includes("healthy")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {result.diseaseName.toLowerCase().includes("healthy") ? "✅" : "⚠️"}{" "}
                  {result.diseaseName}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                  Confidence
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-3 max-w-xs">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {(result.confidence * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {previewUrl && (
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider mb-2 self-start md:self-center">
                  Analyzed Image
                </span>
                <img
                  src={previewUrl}
                  alt="Analyzed"
                  className="max-h-48 rounded-lg object-contain border shadow-sm"
                />
              </div>
            )}
          </div>

          {result.treatment && (
            <div className="mt-8 border-t pt-6">
              <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                🛡️ Recommended Treatment / Remedy
              </span>
              <div className={`mt-3 p-5 rounded-xl border flex items-start gap-4 ${
                result.diseaseName.toLowerCase().includes("healthy")
                  ? "bg-green-50/50 border-green-200 text-green-800"
                  : "bg-amber-50/60 border-amber-200 text-amber-900"
              }`}>
                <span className="text-2xl mt-0.5">
                  {result.diseaseName.toLowerCase().includes("healthy") ? "✨" : "📋"}
                </span>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">
                    {result.diseaseName.toLowerCase().includes("healthy") ? "Prevention & Maintenance" : "Treatment Steps"}
                  </h4>
                  <p className="text-sm leading-relaxed font-medium">
                    {result.treatment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindDisease;