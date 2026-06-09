<!-- Improved README: adds emojis, links, and a quick-start guide -->
# 🎯 HireTrack

HireTrack is a modern job-application tracker that helps users organize, monitor, and optimize their job search. It combines a visual kanban pipeline, analytics, and secure authentication so your job hunt lives in one place.

[Explore the Frontend](Frontend/) • [Explore the Backend](Backend/) • [Open the App (dev)](Frontend/#readme)

---

## 🚀 Quick Start

1. Clone the repo:

```bash
git clone https://github.com/abdulHannan22/HireTrack.git
cd HireTrack
```

2. Start the backend (from `Backend`):

```bash
cd Backend
npm install
npm run dev
```

3. Start the frontend (from `Frontend`):

```bash
cd Frontend
npm install
npm run dev
```

Tips:
- Backend runs on `http://localhost:3001` by default.
- Frontend (Vite) runs on `http://localhost:5173` by default.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Development Notes](#-development-notes)
- [Author & Links](#-author--links)

---

## ✨ Features

- 🎯 **Job Application Management**: Create, view, update, and delete job postings with ease.
- 📝 **Applicant Tracking**: Monitor the status of each application through various stages (e.g., Applied, Interview, Offer, Rejected).
- 📊 **Interactive Dashboard**: Gain insights into your hiring pipeline with an intuitive dashboard.
- 🔐 **User Authentication & Authorization**: Secure user registration, login, and role-based access control.
- 📱 **Responsive Design**: Seamless experience across desktop and mobile devices.

---

## 🛠️ Tech Stack

- Frontend: React, Vite, Tailwind CSS, Recharts, Axios
- Backend: Node.js, Express, MongoDB (Mongoose), JWT
- Deploy: Vercel (frontend) + Render (backend)

---

## 📁 Project Structure (high level)

```text
HireTrack/
├── Frontend/            # React app (Vite + Tailwind)
├── Backend/             # Express API + Mongoose models
└── README.md
```

Quick links:

- Frontend entry: [Frontend/src/main.jsx](Frontend/src/main.jsx)
- Frontend routes: [Frontend/src/pages](Frontend/src/pages)
- Backend entry: [Backend/index.js](Backend/index.js)
- Backend routes: [Backend/routes](Backend/routes)

---

## 🔌 API Endpoints (core)

Authentication:

```
POST /auth/signup
POST /auth/signin
POST /auth/logout
GET  /auth/me
```

Applications:

```
GET    /applications
POST   /applications
PUT    /applications/:id
DELETE /applications/:id
```

See `Backend/routes` for implementation details.

---

## 🧭 Development Notes

- Create `.env` in `Backend` with the following:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

- In `Frontend`, set `VITE_API_URL=http://localhost:3001` in a `.env` file for local dev.

- Use Postman or a similar tool to exercise API endpoints while developing.

---

## 🧪 Helpful Commands

- Start backend: `cd Backend && npm run dev`
- Start frontend: `cd Frontend && npm run dev`
- Run frontend lint: `cd Frontend && npm run lint`
- Run backend lint: `cd Backend && npm run lint`

---

## 👨‍💻 Author & Links

**Abdul Hannan Dheriwala**

- GitHub: https://github.com/abdulHannan22
- LinkedIn: https://www.linkedin.com/in/abdulhannan-dheriwala-205506274/

---

## 📄 License

This project is licensed under the MIT License.
