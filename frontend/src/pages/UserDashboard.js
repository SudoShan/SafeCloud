import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadFile from "../components/UploadFile";
import RecentFiles from "../components/RecentFiles";
import "../styles/dashboard.css";

function UserDashboard() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [recentFiles, setRecentFiles] = useState([]);

  const navigate = useNavigate();

  // ── Fetch file list ───────────────────────────────────────────────────────

  const fetchFiles = useCallback(() => {
    axios
      .get(`http://localhost:5000/api/files`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Failed to fetch files:", err));
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // ── Crypto helpers ────────────────────────────────────────────────────────

  const deriveKey = async (password, salt) => {
    const enc = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return await window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const decryptPrivateKey = async (encryptedB64, password, saltB64, ivB64) => {
    const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
    const encrypted = Uint8Array.from(atob(encryptedB64), (c) => c.charCodeAt(0));

    const key = await deriveKey(password, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  };

  const importPrivateKey = async (keyStr) => {
    const binary = Uint8Array.from(atob(keyStr), (c) => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
      "pkcs8",
      binary,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );
  };

  // ── View / decrypt file ───────────────────────────────────────────────────

  const openFile = async (file) => {
    try {
      // FIX: use window.userPassword (set at login), not an undefined variable
      const password = window.userPassword;
      if (!password) {
        alert("Session expired. Please log in again.");
        navigate("/");
        return;
      }

      const encryptedPrivateKey = localStorage.getItem("encryptedPrivateKey");
      const saltB64 = localStorage.getItem("salt");
      const ivB64 = localStorage.getItem("iv");

      // Step 1 – decrypt RSA private key with user's password
      const privateKeyStr = await decryptPrivateKey(encryptedPrivateKey, password, saltB64, ivB64);
      const privateKey = await importPrivateKey(privateKeyStr);

      // Step 2 – download encrypted file from server
      // FIX: server returns JSON { fileId, fileName, encryptedAESKey, fileData (base64) }
      //      not a raw arraybuffer
      const res = await axios.get(`http://localhost:5000/api/files/${file._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const { encryptedAESKey, fileData } = res.data;

      // Step 3 – decrypt FEK with RSA private key
      const fekBuffer = Uint8Array.from(atob(encryptedAESKey), (c) => c.charCodeAt(0));
      const fek = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        fekBuffer
      );

      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        fek,
        "AES-GCM",
        false,
        ["decrypt"]
      );

      // Step 4 – extract prepended IV and decrypt file
      // FIX: upload stores [ IV (12 bytes) | ciphertext ]; extract IV from front
      const fullBuffer = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));
      const fileIv = fullBuffer.slice(0, 12);
      const ciphertext = fullBuffer.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fileIv },
        cryptoKey,
        ciphertext
      );

      setContent(new TextDecoder().decode(decrypted));
      setSelectedFile(file);

      setRecentFiles((prev) => {
        const filtered = prev.filter((f) => f !== file.fileName);
        return [file.fileName, ...filtered].slice(0, 5);
      });
    } catch (err) {
      console.error("Failed to open file:", err);
      alert("Failed to decrypt file.");
    }
  };

  // ── Download decrypted file ───────────────────────────────────────────────

  const downloadFile = async (file) => {
    try {
      const password = window.userPassword;
      if (!password) {
        alert("Session expired. Please log in again.");
        navigate("/");
        return;
      }

      const encryptedPrivateKey = localStorage.getItem("encryptedPrivateKey");
      const saltB64 = localStorage.getItem("salt");
      const ivB64 = localStorage.getItem("iv");

      const privateKeyStr = await decryptPrivateKey(encryptedPrivateKey, password, saltB64, ivB64);
      const privateKey = await importPrivateKey(privateKeyStr);

      const res = await axios.get(`http://localhost:5000/api/files/${file._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const { encryptedAESKey, fileData } = res.data;

      const fekBuffer = Uint8Array.from(atob(encryptedAESKey), (c) => c.charCodeAt(0));
      const fek = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, fekBuffer);

      const cryptoKey = await window.crypto.subtle.importKey(
        "raw", fek, "AES-GCM", false, ["decrypt"]
      );

      const fullBuffer = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));
      const fileIv = fullBuffer.slice(0, 12);
      const ciphertext = fullBuffer.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fileIv },
        cryptoKey,
        ciphertext
      );

      // Trigger browser download
      const blob = new Blob([decrypted]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file.");
    }
  };

  // ── Delete file ───────────────────────────────────────────────────────────

  const deleteFile = async (file) => {
    if (!window.confirm(`Delete "${file.fileName}"?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/${file._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (selectedFile?._id === file._id) {
        setSelectedFile(null);
        setContent("");
      }
      fetchFiles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete file.");
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (_) {
      // continue with local logout even if request fails
    }
    localStorage.clear();
    window.userPassword = null;
    navigate("/");
  };

  return (
    <div className="dashboard">

      <div className="header">
        <h2>User Dashboard</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="upload-section">
        <UploadFile onUploadSuccess={fetchFiles} />
      </div>

      <div className="user-layout">

        <div className="files-section">
          <h3>My Files</h3>
          {files.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            <ul className="file-list">
              {files.map((file) => (
                <li key={file._id}>
                  <span
                    className="file-name-link"
                    onClick={() => openFile(file)}
                  >
                    {file.fileName}
                  </span>
                  <div className="file-actions">
                    <button onClick={() => openFile(file)}>View</button>
                    <button onClick={() => downloadFile(file)}>Download</button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteFile(file)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="content-section">
          <h3>{selectedFile ? selectedFile.fileName : "File Content"}</h3>
          <pre className="file-content">
            {content || "Select a file to view its content."}
          </pre>
        </div>

      </div>

      <RecentFiles
        recentFiles={recentFiles}
        openFile={(name) => {
          const f = files.find((x) => x.fileName === name);
          if (f) openFile(f);
        }}
      />

    </div>
  );
}

export default UserDashboard;