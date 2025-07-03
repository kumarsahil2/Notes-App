# OTP Notes App

A full-stack MERN application for secure note-taking with OTP-based authentication and JWT-protected routes.

---

## Features

- **OTP-based Signup & Signin:** No password, only email, username, and DOB.
- **Email OTP Delivery:** Users receive OTPs via email for authentication.
- **JWT Authentication:** Secure note creation/deletion for logged-in users.
- **Personal Notes:** Each user can create, view, and delete their own notes.
- **Responsive Frontend:** Modern React UI.

---

## Tech Stack

- **Frontend:** React, TypeScript, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer
- **Deployment:** Render (backend), Vercel/Netlify/Render (frontend)

---

## Environment Variables

### Backend (`server/.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/kumarsahil2/Notes-App.git
```

### 2. **Backend Setup**
```bash
cd server
npm install
# Add your .env file as shown above
npm run dev
```
- The backend runs on `http://localhost:5001` by default.

### 3. **Frontend Setup**
```bash
cd client
npm install
npm start
```
- The frontend runs on `http://localhost:3000` by default.

---

## Deployment

### **Backend (Render)**
- Deploy your backend to Render.
- Set all environment variables in the Render dashboard.
- Example Render URL: `https://notes-app-ybi0.onrender.com`

### **Frontend**
- Update `src/api/axios.ts`:
  ```typescript
  baseURL: 'https://notes-app-ybi0.onrender.com/api'
  ```
- Deploy to Vercel, Netlify, or Render.
- **For SPA Routing:**  
  - On Netlify: Add `_redirects` file with `/*    /index.html   200`
  - On Vercel: Add `vercel.json` with rewrites.
  - On Render: Add a rewrite rule: `Source: /*  Destination: /index.html`

---

## API Endpoints

### **Auth**
- `POST /api/auth/signup/request-otp` — Request OTP for signup
- `POST /api/auth/signup/verify-otp` — Verify OTP and create user
- `POST /api/auth/signin/request-otp` — Request OTP for signin
- `POST /api/auth/signin/verify-otp` — Verify OTP and get JWT

### **Notes** (JWT required)
- `GET /api/notes` — Get all notes for user
- `POST /api/notes` — Create a note (`{ title, content }`)
- `DELETE /api/notes/:id` — Delete a note

---

## Usage

1. **Sign Up:** Enter name, DOB, email. Receive OTP, verify, and create account.
2. **Sign In:** Enter email, receive OTP, verify, and get JWT token.
3. **Notes:** Create, view, and delete notes. Only visible to the logged-in user.

---

## Security

- **Passwords:** Not stored or used. Authentication is OTP-based.
- **JWT:** Used for all protected routes.
- **Email:** Use an app password for Gmail or a service-specific password.

---

## License

MIT

---

## Author

- Kumar Sahil | https://github.com/kumarsahil2
