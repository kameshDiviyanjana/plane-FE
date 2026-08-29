import React, { useState, useEffect } from "react";
import authFetch from "../api/authfetch";

interface PredictionItem {
  id: number;
  plantName: string;
  diseaseName: string;
  confidence: number;
  imageUrl: string | null;
  treatment?: string;
  createdAt: string;
}

const DiseaseList = () => {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?.id;

        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const res = await authFetch.get<PredictionItem[]>(`/predictions/user/${userId}`);
        setPredictions(res.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load prediction history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📋 Prediction History</h1>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          Total: {predictions.length}
        </span>
      </div>

      {predictions.length === 0 ? (
        <div className="rounded-xl bg-white p-8 shadow-md text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-600 font-medium mb-2">No predictions found yet</p>
          <p className="text-sm text-gray-400">
            Go to the "Find Disease" section and upload a leaf image to diagnose.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {predictions.map((item) => {
            const isHealthy = item.diseaseName.toLowerCase().includes("healthy");
            const formattedDate = new Date(item.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <div
                key={item.id}
                className="rounded-xl bg-white p-6 shadow-md border-l-4 transition hover:shadow-lg flex flex-col md:flex-row gap-6"
                style={{ borderLeftColor: isHealthy ? "#22c55e" : "#ef4444" }}
              >
                {/* Left content: Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400">
                      📅 {formattedDate}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      isHealthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {isHealthy ? "Healthy" : "Diseased"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                        Plant
                      </span>
                      <p className="text-base font-bold text-gray-800">
                        🌿 {item.plantName}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                        Condition / Disease
                      </span>
                      <p className={`text-base font-bold ${isHealthy ? "text-green-600" : "text-red-600"}`}>
                        {item.diseaseName}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                      Confidence
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-xs">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: `${item.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {item.treatment && (
                    <div className={`mt-3 p-4 rounded-lg border text-sm leading-relaxed ${
                      isHealthy ? "bg-green-50/50 border-green-200 text-green-800" : "bg-amber-50/60 border-amber-200 text-amber-900"
                    }`}>
                      <h4 className="font-bold text-xs uppercase tracking-wider mb-1">
                        {isHealthy ? "Prevention & Maintenance" : "Recommended Treatment"}
                      </h4>
                      <p className="font-medium">{item.treatment}</p>
                    </div>
                  )}
                </div>

                {/* Right content: Image preview if available */}
                {item.imageUrl && (
                  <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt="Diagnosed leaf"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiseaseList;