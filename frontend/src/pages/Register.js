import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Register(){

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const generateKeyPair = async () => {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
        );
    };

    const exportKey = async (key) => {
        const exported = await window.crypto.subtle.exportKey("spki", key);
        return btoa(String.fromCharCode(...new Uint8Array(exported)));
    };

    const exportPrivateKey = async (key) => {
        const exported = await window.crypto.subtle.exportKey("pkcs8", key);
        return btoa(String.fromCharCode(...new Uint8Array(exported)));
    };

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
            {
                name: "PBKDF2",
                salt,
                iterations: 100000,
                hash: "SHA-256",
            },
            baseKey,
            {
                name: "AES-GCM",
                length: 256,
            },
            false,
            ["encrypt", "decrypt"]
        );
    };
    const encryptPrivateKey = async (privateKey, password) => {
        const enc = new TextEncoder();
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);

        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            enc.encode(privateKey)
        );

        return {
            encryptedPrivateKey: btoa(
            String.fromCharCode(...new Uint8Array(encrypted))
            ),
            salt: btoa(String.fromCharCode(...salt)),
            iv: btoa(String.fromCharCode(...iv)),
        };
    };

    const register = async () => {
        const keyPair = await generateKeyPair();
        const publicKey = await exportKey(keyPair.publicKey);
        const privateKey = await exportPrivateKey(keyPair.privateKey);
        const { encryptedPrivateKey, salt, iv } = await encryptPrivateKey(privateKey, password);

        await axios.post("http://localhost:5000/api/auth/register",{
            username,
            password,
            publicKey,
            encryptedPrivateKey,
            salt,
            iv
        })

        alert("Registered Successfully!! Please login to continue.");
        navigate("/");
    }

    return(
    <div className="login-container">
      <h2>Register</h2>
 
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
 
      <button className="login-btn" onClick={register}>
        Register
      </button>
 
      <p className="register-link">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
    )
}

export default Register;