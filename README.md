# 🔐 Secure Cloud Storage System

## 📌 Introduction
This project is a Secure Cloud Storage Web Application that allows users to upload, download, and manage files securely. The system ensures that files are encrypted before storage, encryption keys are securely managed, and all user activities are logged securely.

The project demonstrates how encryption, authentication, key management, and secure communication can be integrated into a web application to build a secure cloud storage prototype.

---

## 🚀 Features
- Secure user registration and login
- RSA public–private key generation
- Private key encryption using user password
- AES file encryption before upload
- RSA encryption of AES keys
- Secure file upload and download
- JWT-based authentication
- Role-Based Access Control (Admin/User)
- Encrypted logging system
- Admin activity monitoring
- HTTPS/TLS secure communication
- Secure file storage using Multer

---

## 🏗️ System Architecture Overview
The system follows a client–server architecture where encryption and decryption operations are performed on the client side, and the server handles authentication, file storage, metadata management, and logging.

### High Level Flow
1. User registers → RSA keys generated → Private key encrypted → Stored in database  
2. User logs in → JWT token generated  
3. User uploads file → File encrypted using AES → AES key encrypted using RSA → Stored on server  
4. User downloads file → AES key decrypted using private key → File decrypted on client  
5. All activities are logged and encrypted using admin secret key  
6. Admin monitors system logs and user activity using RBAC  

---

## 🛠️ Technologies Used
| Technology | Purpose |
|------------|---------|
| React.js | Frontend user interface |
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| AES | File encryption |
| RSA | Key encryption |
| JWT | Authentication |
| Multer | File upload handling |
| HTTPS/TLS | Secure communication |
| RBAC | Access control |
| Encrypted Logging | Activity monitoring |

---

## 📁 Project Structure
```
SafeCloud/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── App.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── storage/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Backend Overview

### Authentication
- User registration and login
- Password hashing
- JWT token generation
- Authentication middleware
- Session management

### Key Management
- RSA key pair generated during registration
- Private key encrypted using password-derived key
- Public key stored in database
- AES keys encrypted using RSA

### File Management
- Files encrypted using AES before upload
- Encrypted files stored on server using Multer
- Encrypted AES keys stored in database
- Files decrypted on client during download

### Logging System
- All user activities logged
- Logs encrypted using admin secret key
- Only admin can view logs (RBAC)

---

# Frontend Overview

This folder contains the React frontend for the SafeCloud application. It provides the UI for user registration, login, file upload, recent files listing, and an admin dashboard with logs and stats.

## Prerequisites

- Node.js (v14+ recommended)
- npm (or yarn)

## Install

From the `frontend` directory run:

```bash
npm install
```

## Run (development)

```bash
npm start
```

## Build (production)

```bash
npm run build
```

## Available scripts (from package.json)

- `start`: Runs the app in development mode.
- `build`: Builds the app for production.
- `test`: Runs the test runner.
- `eject`: Ejects from Create React App (one-way).

## Dependencies

Key dependencies are `react`, `react-dom`, `react-router-dom`, `axios`, `chart.js`, and `react-chartjs-2`.

## Project structure

public/
- `index.html` — HTML entry.
- `manifest.json` — Web app manifest.
- `robots.txt` — Robots rules.

src/
- `index.js` — App bootstrap and routing.
- `App.js` — Main app component.
- `index.css` — Global styles.

components/
- `FileList.js` — Component to display a user's files list.
- `RecentFiles.js` — Component showing recently uploaded files.
- `UploadFile.js` — Component and form to upload files.

pages/
- `AdminDashboard.js` — Admin view with charts and logs.
- `Login.js` — Login page.
- `Register.js` — Registration page.
- `UserDashboard.js` — User dashboard with upload & file list.

services/
- `api.js` — Axios instance and helper functions for backend API calls.

styles/
- `admindashboard.css` — Styles for the admin dashboard.
- `dashboard.css` — Styles for the user dashboard.
- `login.css` — Styles for login/register pages.
- `upload.css` — Styles for upload components.

Other files
- `package.json` — npm configuration and scripts.

## Where to look for common tasks

- To modify API calls: see `src/services/api.js`.
- To add components: put them under `src/components` and import into pages.
- To update routing or global layout: edit `src/App.js` and `src/index.js`.
- To tweak styles: edit files under `src/styles` or `src/index.css`.

## Notes

- This project was created with Create React App. Keep CRA constraints in mind when ejecting or changing build configs.
- Charts use Chart.js via `react-chartjs-2`; see `AdminDashboard.js` for examples.

---

## 🔐 Security Features
- AES file encryption
- RSA key encryption
- Encrypted private key storage
- JWT authentication
- Role-Based Access Control
- Encrypted logging
- HTTPS/TLS secure communication
- Secure file storage