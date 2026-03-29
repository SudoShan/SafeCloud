import React, { useEffect, useState } from "react";
import axios from "axios";

function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/files", {
        headers: {
          // FIX: auth header was missing
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Failed to fetch files:", err));
  }, []);

  return (
    <div>
      <h3>My Files</h3>
      {files.map((file) => (
        <div key={file._id}>
          {file.fileName}
          <button>View</button>
        </div>
      ))}
    </div>
  );
}

export default FileList;