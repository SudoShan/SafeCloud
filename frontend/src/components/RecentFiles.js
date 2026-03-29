import React from "react";

function RecentFiles({ recentFiles, openFile }) {
  return (
    <div className="recent-section">
      <h3>Recently Viewed</h3>
      <ul>
        {recentFiles.length === 0 ? (
          <p>No recent files</p>
        ) : (
          recentFiles.map((file, index) => (
            <li key={index} onClick={() => openFile(file)}>
              📄 {file}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default RecentFiles;