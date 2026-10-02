
// // import './App.css'
// // import LogingPage from './LogingPage'

// // function App() {

// //   return (
// //  <>
// //  <div>
// // <LogingPage /> </div>
// //  </>
// //   )
// // }

// // export default App

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LogingPage from "./LogingPage";
// import RegisterPage from "./RegisterPage";
// import Dashboard from "./componets/Dashboard";
// import FindDisease from "./componets/FindDisease";
// import AddDisease from "./componets/AddDisease";
// import DiseaseList from "./componets/DiseaseList";
// import DashboardComponents from "./componets/DashboardComponents";
// import LandingPage from "./componets/LandingPage";
// import AdminDashboard from "./componets/AdminDashboard";


// function App() {
//   return (
//     <BrowserRouter>

//       <Routes>

//         {/* Public Landing Page */}
//         <Route
//           path="/"
//           element={<LandingPage />}
//         />

//         {/* Login */}
//         <Route
//           path="/login"
//           element={<LogingPage />}
//         />

//         {/* Register */}
//         <Route
//           path="/register"
//           element={<RegisterPage />}
//         />

//         {/* Dashboard Layout (Pathless Route) */}
//         <Route
//           element={<DashboardComponents />}
//         >

//           {/* /dashboard */}
//           <Route
//             path="/dashboard"
//             element={<Dashboard />}
//           />

//           {/* /finddisease */}
//           <Route
//             path="/finddisease"
//             element={<FindDisease />}
//           />

//           {/* /adddisease */}
//           <Route
//             path="/adddisease"
//             element={<AddDisease />}
//           />

//           {/* /diseases */}
//           <Route
//             path="/diseases"
//             element={<DiseaseList />}
//           />

         

//         </Route>

//  {/* /admin */}
//           <Route
//             path="/admin"
//             element={<AdminDashboard />}
//           />
//       </Routes>

//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LogingPage from "./LogingPage";
import RegisterPage from "./RegisterPage";

import Dashboard from "./componets/Dashboard";
import FindDisease from "./componets/FindDisease";
import AddDisease from "./componets/AddDisease";
import DiseaseList from "./componets/DiseaseList";
import DashboardComponents from "./componets/DashboardComponents";
import LandingPage from "./componets/LandingPage";
import AdminDashboard from "./componets/AdminDashboard";
import ProtectedRoute from "./componets/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LogingPage />} />

        <Route path="/register" element={<RegisterPage />} />


        {/* ================= USER + ADMIN ================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />
          }
        >
          <Route element={<DashboardComponents />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/finddisease"
              element={<FindDisease />}
            />

            <Route
              path="/diseases"
              element={<DiseaseList />}
            />

          </Route>
        </Route>


        {/* ================= ADMIN ONLY ================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]} />
          }
        >
           <Route element={<DashboardComponents />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/adddisease"
            element={<AddDisease />}
          />
        </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;