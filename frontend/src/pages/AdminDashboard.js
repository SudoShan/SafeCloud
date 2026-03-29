// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/dashboard.css";

// const API = "http://localhost:5000/api";

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const [logs, setLogs] = useState([]);
//   const [showLogs, setShowLogs] = useState(false);

//   const authHeader = () => ({
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   });

//   // ── Fetch logs ────────────────────────────────────────────────────────────

//   const fetchLogs = () => {
//     axios
//       .get(`${API}/admin/logs`, { headers: authHeader() })
//       .then((res) => {
//         setLogs(res.data);
//         setShowLogs(true);
//       })
//       .catch((err) => console.error("Error fetching logs:", err));
//   };

//   // ── Logout ────────────────────────────────────────────────────────────────

//   const logout = async () => {
//     try {
//       await axios.post(`${API}/auth/logout`, {}, { headers: authHeader() });
//     } catch (_) {}
//     localStorage.clear();
//     navigate("/");
//   };

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <div className="dashboard">

//       <div className="header">
//         <h2>Admin Dashboard</h2>
//         <div>
//           <button className="admin-btn" onClick={fetchLogs}>Logs</button>
//           <button className="logout-btn" onClick={logout}>Logout</button>
//         </div>
//       </div>

//       {showLogs && (
//         <div className="logs-container">
//           <h3 className="logs-title">Recent Activity Logs</h3>
//           <table className="logs-table">
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>File Name</th>
//                 <th>Action</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((log, index) => (
//                 <tr key={index}>
//                   <td>{log.user}</td>
//                   <td>{log.file}</td>
//                   <td>
//                     <span className={`status ${log.action?.toLowerCase()}`}>
//                       {log.action}
//                     </span>
//                   </td>
//                   <td>{log.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//     </div>
//   );
// }

// export default AdminDashboard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/admindashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  // ── Dummy Logs ─────────────────────────────────────
  const [logs] = useState([
    { user: "Alice", file: "report.pdf", action: "UPLOAD", date: "2026-03-29" },
    { user: "Bob", file: "data.csv", action: "DOWNLOAD", date: "2026-03-29" },
    { user: "Charlie", file: "notes.txt", action: "DELETE", date: "2026-03-28" },
    { user: "Alice", file: "design.png", action: "DOWNLOAD", date: "2026-03-28" },
  ]);

  const [showLogs, setShowLogs] = useState(false);

  // ── Stats (Dummy) ─────────────────────────────────
  const stats = {
    totalUsers: 12,
    totalFiles: 45,
    uploads: 30,
    downloads: 20,
  };

  // ── Graph Data ────────────────────────────────────
  const chartData = {
    labels: ["Uploads", "Downloads", "Deletes"],
    datasets: [
      {
        label: "Activity Count",
        data: [30, 20, 5],
      },
    ],
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="card">
          <h3>{stats.totalUsers}</h3>
          <p>Users</p>
        </div>
        <div className="card">
          <h3>{stats.totalFiles}</h3>
          <p>Files</p>
        </div>
        <div className="card">
          <h3>{stats.uploads}</h3>
          <p>Uploads</p>
        </div>
        <div className="card">
          <h3>{stats.downloads}</h3>
          <p>Downloads</p>
        </div>
      </div>

      {/* Graph */}
      <div className="chart-container">
        <h3>Activity Overview</h3>
        <Bar data={chartData} />
      </div>

      {/* Logs Button */}
      <div className="logs-btn-container">
        <button className="admin-btn" onClick={() => setShowLogs(!showLogs)}>
          {showLogs ? "Hide Logs" : "View Logs"}
        </button>
      </div>

      {/* Logs Table */}
      {showLogs && (
        <div className="logs-container">
          <h3 className="logs-title">Recent Activity Logs</h3>
          <table className="logs-table">
            <thead>
              <tr>
                <th>User</th>
                <th>File Name</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.user}</td>
                  <td>{log.file}</td>
                  <td>
                    <span className={`status ${log.action.toLowerCase()}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;