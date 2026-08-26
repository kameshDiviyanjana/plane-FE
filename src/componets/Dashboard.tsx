import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        Welcome to Disease Detection System
      </h1>

      <p className="mb-8 text-gray-600">
        Manage plant diseases and identify diseases using the system.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Find Disease */}
        <Link
          to="/finddisease"
          className="rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-4 text-4xl">
            🔍
          </div>

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Find Disease
          </h2>

          <p className="text-gray-600">
            Upload a plant image and identify possible diseases.
          </p>
        </Link>

        {/* Add Disease */}
        <Link
          to="/adddisease"
          className="rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-4 text-4xl">
            ➕
          </div>

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Add Disease
          </h2>

          <p className="text-gray-600">
            Add new plant disease information to the system.
          </p>
        </Link>

        {/* Disease List */}
        <Link
          to="/diseases"
          className="rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-4 text-4xl">
            📋
          </div>

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Disease List
          </h2>

          <p className="text-gray-600">
            View and manage existing diseases.
          </p>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;