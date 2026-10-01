import React, { useEffect, useState } from "react";
import {
  fetchAllUsers,
  fetchAllPredictions,
  deleteUserById,
  deletePredictionById,
} from "../api/admin-api";
import type { UserDetail, PredictionDetail } from "../api/admin-api";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"predictions" | "users">("predictions");
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [predictions, setPredictions] = useState<PredictionDetail[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingPredictions, setLoadingPredictions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "diseased">("all");
  const [selectedUserFilter, setSelectedUserFilter] = useState<number | null>(null);

  // Modals
  const [selectedTreatment, setSelectedTreatment] = useState<{ plant: string; disease: string; treatment: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "user" | "prediction"; id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setError(null);
    setLoadingUsers(true);
    setLoadingPredictions(true);

    try {
      const [usersData, predictionsData] = await Promise.all([
        fetchAllUsers().catch((err) => {
          console.error("Error fetching users:", err);
          return [] as UserDetail[];
        }),
        fetchAllPredictions().catch((err) => {
          console.error("Error fetching predictions:", err);
          return [] as PredictionDetail[];
        }),
      ]);

      setUsers(usersData);
      setPredictions(predictionsData);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin data.");
    } finally {
      setLoadingUsers(false);
      setLoadingPredictions(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete Action Handler
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      if (deleteConfirm.type === "user") {
        await deleteUserById(deleteConfirm.id);
        setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
        // Remove user's predictions from local state too
        setPredictions((prev) => prev.filter((p) => p.userId !== deleteConfirm.id));
        showToast(`User "${deleteConfirm.name}" deleted successfully.`);
      } else {
        await deletePredictionById(deleteConfirm.id);
        setPredictions((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
        showToast(`Prediction #${deleteConfirm.id} deleted successfully.`);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to delete item.");
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Helper map: User ID -> Username
  const userMap = new Map<number, string>();
  users.forEach((u) => userMap.set(u.id, u.username));

  // Prediction stats
  const totalPredictions = predictions.length;
  const healthyCount = predictions.filter((p) => p.diseaseName.toLowerCase().includes("healthy")).length;
  const diseasedCount = totalPredictions - healthyCount;
  const avgConfidence =
    totalPredictions > 0
      ? (predictions.reduce((acc, p) => acc + p.confidence, 0) / totalPredictions) * 100
      : 0;

  // Filtered Predictions
  const filteredPredictions = predictions.filter((p) => {
    const matchesSearch =
      p.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.userId && userMap.get(p.userId)?.toLowerCase().includes(searchQuery.toLowerCase()));

    const isHealthy = p.diseaseName.toLowerCase().includes("healthy");
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "healthy" && isHealthy) ||
      (statusFilter === "diseased" && !isHealthy);

    const matchesUser = selectedUserFilter === null || p.userId === selectedUserFilter;

    return matchesSearch && matchesStatus && matchesUser;
  });

  // Filtered Users
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-green-800 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-green-600 animate-bounce">
          <span className="text-xl">✅</span>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-white/10 p-2.5 rounded-xl backdrop-blur-md">👑</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Center</h1>
              <p className="text-green-100 text-sm mt-1">
                Monitor all plant disease predictions and manage system user accounts in real-time.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl font-semibold backdrop-blur-md transition cursor-pointer text-sm"
        >
          🔄 Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-500 font-bold hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
            👥
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Users</p>
            <h3 className="text-2xl font-extrabold text-gray-800 mt-0.5">{loadingUsers ? "..." : users.length}</h3>
            <p className="text-xs text-blue-600 font-medium mt-1">Registered Accounts</p>
          </div>
        </div>

        {/* Total Predictions */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            🧪
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Predictions</p>
            <h3 className="text-2xl font-extrabold text-gray-800 mt-0.5">{loadingPredictions ? "..." : totalPredictions}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Scans Performed</p>
          </div>
        </div>

        {/* Healthy Ratio */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="h-14 w-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl font-bold">
            🌿
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Healthy Plants</p>
            <h3 className="text-2xl font-extrabold text-gray-800 mt-0.5">
              {healthyCount}{" "}
              <span className="text-xs font-normal text-gray-400">
                ({totalPredictions > 0 ? ((healthyCount / totalPredictions) * 100).toFixed(0) : 0}%)
              </span>
            </h3>
            <p className="text-xs text-green-600 font-medium mt-1">No Disease Found</p>
          </div>
        </div>

        {/* Avg Confidence */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
            🎯
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Avg Confidence</p>
            <h3 className="text-2xl font-extrabold text-gray-800 mt-0.5">{avgConfidence.toFixed(1)}%</h3>
            <p className="text-xs text-purple-600 font-medium mt-1">Model Accuracy Rate</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Tab Selector */}
          <div className="flex bg-gray-200/70 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab("predictions");
                setSearchQuery("");
              }}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "predictions"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>📋</span> All Predictions ({predictions.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setSearchQuery("");
                setSelectedUserFilter(null);
              }}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "users"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>👥</span> User Display ({users.length})
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder={
                activeTab === "predictions"
                  ? "Search plant, disease, or user..."
                  : "Search username or email..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>

        {/* Tab 1: All Predictions */}
        {activeTab === "predictions" && (
          <div className="p-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-bold text-gray-500 mr-2">Filter Status:</span>
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white border text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All ({predictions.length})
                </button>
                <button
                  onClick={() => setStatusFilter("healthy")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    statusFilter === "healthy"
                      ? "bg-green-600 text-white"
                      : "bg-white border text-green-700 hover:bg-green-50"
                  }`}
                >
                  Healthy ({healthyCount})
                </button>
                <button
                  onClick={() => setStatusFilter("diseased")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    statusFilter === "diseased"
                      ? "bg-amber-600 text-white"
                      : "bg-white border text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  Diseased ({diseasedCount})
                </button>
              </div>

              {selectedUserFilter !== null && (
                <div className="flex items-center gap-2 text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg">
                  <span>User Filter: {userMap.get(selectedUserFilter) || `ID ${selectedUserFilter}`}</span>
                  <button
                    onClick={() => setSelectedUserFilter(null)}
                    className="hover:text-blue-950 font-bold ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {loadingPredictions ? (
              <div className="py-12 text-center text-gray-500">
                <div className="inline-block animate-spin text-3xl mb-2">⏳</div>
                <p>Loading predictions data...</p>
              </div>
            ) : filteredPredictions.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-4xl mb-3">🍃</p>
                <p className="font-semibold text-lg">No predictions match your filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-xs uppercase font-bold tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Plant</th>
                      <th className="p-4">Condition / Disease</th>
                      <th className="p-4">Confidence</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Treatment</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {filteredPredictions.map((p) => {
                      const isHealthy = p.diseaseName.toLowerCase().includes("healthy");
                      const username = p.userId ? userMap.get(p.userId) || `User #${p.userId}` : "Guest";

                      return (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition">
                          <td className="p-4 font-mono font-bold text-gray-400">#{p.id}</td>
                          <td className="p-4 font-semibold text-gray-800">
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs">
                              👤 {username}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-gray-900">🌿 {p.plantName}</td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                isHealthy
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isHealthy ? "✅" : "⚠️"} {p.diseaseName}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    p.confidence >= 0.8
                                      ? "bg-green-500"
                                      : p.confidence >= 0.5
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${p.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-bold text-xs text-gray-700">
                                {(p.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500 text-xs">
                            {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 text-center">
                            {p.treatment ? (
                              <button
                                onClick={() =>
                                  setSelectedTreatment({
                                    plant: p.plantName,
                                    disease: p.diseaseName,
                                    treatment: p.treatment!,
                                  })
                                }
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200 transition cursor-pointer"
                              >
                                View Remedy
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: "prediction",
                                  id: p.id,
                                  name: `${p.plantName} (${p.diseaseName})`,
                                })
                              }
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete Prediction"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: User Display */}
        {activeTab === "users" && (
          <div className="p-6">
            {loadingUsers ? (
              <div className="py-12 text-center text-gray-500">
                <div className="inline-block animate-spin text-3xl mb-2">⏳</div>
                <p>Loading users list...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-4xl mb-3">👥</p>
                <p className="font-semibold text-lg">No users found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((u) => {
                  const userPreds = predictions.filter((p) => p.userId === u.id);
                  const userHealthy = userPreds.filter((p) => p.diseaseName.toLowerCase().includes("healthy")).length;

                  return (
                    <div
                      key={u.id}
                      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 text-white font-extrabold text-xl flex items-center justify-center uppercase shadow-sm">
                              {u.username.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg leading-snug">{u.username}</h3>
                              <span className="text-xs text-gray-500 font-mono">User ID #{u.id}</span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: "user",
                                id: u.id,
                                name: u.username,
                              })
                            }
                            className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-400">Email:</span>
                            <span className="font-semibold text-gray-800">{u.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-400">Registered On:</span>
                            <span className="font-semibold text-gray-700">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-400">Total Scans:</span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {userPreds.length} predictions
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          🌱 {userHealthy} healthy scans
                        </span>
                        <button
                          onClick={() => {
                            setSelectedUserFilter(u.id);
                            setActiveTab("predictions");
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          View Predictions →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Treatment Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-600">
                  🌿 {selectedTreatment.plant}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  Treatment: {selectedTreatment.disease}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTreatment(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 text-sm leading-relaxed max-h-60 overflow-y-auto">
              <p className="whitespace-pre-line font-medium">{selectedTreatment.treatment}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedTreatment(null)}
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border space-y-4">
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto mb-3">
                ⚠️
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Are you sure you want to delete {deleteConfirm.type}{" "}
                <strong className="text-gray-900">"{deleteConfirm.name}"</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl font-semibold border text-gray-700 hover:bg-gray-100 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer shadow-md disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
