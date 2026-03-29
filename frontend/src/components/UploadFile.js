import React, { useState } from "react";
import axios from "axios";

function UploadFile() {
  const [file, setFile] = useState(null);

  const generateAESKey = () => {
    return window.crypto.getRandomValues(new Uint8Array(32));
  };

  const encryptFile = async (file, key) => {
    const data = await file.arrayBuffer();

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      key,
      "AES-GCM",
      false,
      ["encrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
 
    return combined;
  };

  const encryptFEK = async (fek, publicKeyStr) => {
    const binary = Uint8Array.from(atob(publicKeyStr), (c) =>
      c.charCodeAt(0)
    );

    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      binary,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      fek
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  };

  const upload = async () => {
    const fek = generateAESKey();

    const { encrypted, iv } = await encryptFile(file, fek);

    const encryptedFEK = await encryptFEK(
      fek,
      localStorage.getItem("publicKey")
    );

    const blob = new Blob([encrypted]);

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("encryptedAESKey", encryptedFEK);
    formData.append("fileName", file.name);

    await axios.post("http://localhost:5000/api/files/upload", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("Encrypted File Uploaded");
  };

  return (
    <div>
      <h3>Upload File</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={upload}>Upload</button>
    </div>
  );
}

export default UploadFile;