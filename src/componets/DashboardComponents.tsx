import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { isTokenValid } from "../api/tokenUtils";

const DashboardComponents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/login");
    }
  }, [navigate]);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-green-600">
            Disease System
          </h1>
        </div>

        <nav className="flex flex-col gap-2 p-4">

          <Link
            to="/dashboard"
            className="rounded-lg p-3 font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
          >
            Dashboard
          </Link>

          <Link
            to="/finddisease"
            className="rounded-lg p-3 font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
          >
            🔍 Find Disease
          </Link>

          <Link
            to="/adddisease"
            className="rounded-lg p-3 font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
          >
            ➕ Add Disease
          </Link>

        </nav>
      </aside>

      {/* Main area */}
      <main className="flex-1">

        {/* Header */}
        <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Dashboard
          </h2>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm font-medium text-gray-600">
                Welcome, <strong className="text-green-600">{user.username}</strong>
              </span>
            )}
            <button
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 cursor-pointer"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <section className="p-8">
          <Outlet />
        </section>

      </main>

    </div>
  );
};

export default DashboardComponents;