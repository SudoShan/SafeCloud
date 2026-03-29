import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Login() {

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const login = async () => {
        const res = await axios.post("http://localhost:5000/api/auth/login",{
            username, 
            password
        });

        if(res.data.role === "admin"){
            navigate("/admin");
        }
        else{
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("publicKey", res.data.publicKey);
            localStorage.setItem("encryptedPrivateKey", res.data.encryptedPrivateKey);
            localStorage.setItem("salt", res.data.salt);
            localStorage.setItem("iv", res.data.iv);
            console.log("Encrypted Private Key:", res.data.encryptedPrivateKey);
            console.log("Public Key:", res.data.publicKey);
            console.log("User Password:", password);
            console.log("Token:", res.data.token);
            window.userPassword = password;
            navigate("/user");
        }
    }

    return (
        <div className="login-container">
            <h2>Secure Cloud Storage</h2>

            <input className="login-input" type="text" placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <input className="login-input" type="password" placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-btn" onClick={login}>
                Login
            </button>

            <p className="register-link">
                New user? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;