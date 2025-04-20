
# 🎓 Alumni Connect Portal

The **Alumni Connect Portal** is a full-stack web application designed to bridge the gap between alumni and current students through a centralized, engaging platform. It encourages long-term community building and networking by allowing users to create profiles, share updates, and connect in real-time.

---

## 🌐 Live Demo

- **Frontend**: [Hosted on Vercel](https://alumni-verse-two.vercel.app/)
- **Backend**: [Hosted on Render (API-based access)](https://alumniverse.onrender.com)

---

## 🧠 Introduction

Alumni play a vital role in shaping the legacy and future development of educational institutions. They contribute as mentors, donors, recruiters, and connectors for current students. However, many institutions lack an efficient, engaging platform to keep alumni connected and involved.

The Alumni Connect Portal addresses this need by offering a space for alumni and students to:
- Create and maintain rich professional profiles
- Share achievements and career milestones
- Communicate via secure private messaging
- Post and engage in community discussions
- Discover peers through powerful search and filter capabilities

---

## 🧰 Tech Stack

### 🖥️ Frontend
- [Next.js](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- Tailwind CSS
- Axios

### ⚙️ Backend
- Node.js + Express
- MongoDB (via Mongoose)
- Socket.IO (for real-time messaging)
- Cloudinary (for file and image uploads)

### ☁️ Hosting
- **Frontend**: Vercel
- **Backend**: Render

---

## 🚀 Features

| Feature | Description | Score |
|--------|-------------|-------|
| 🔐 User Authentication | Login/signup with session security and password management | 15 |
| 📇 Alumni Directory | Searchable list of verified alumni profiles | 15 |
| 🔍 Search & Filter | Filter alumni by batch, branch, job title, or location | 20 |
| 👤 Profile Pages | Editable personal and professional profiles for each user | 15 |
| 📝 Community Feed | Forum for posts, discussions, and networking | 20 |
| 🏷️ Sorting & Tagging | Sort by graduation year, profession, etc. | 10 |
| 📱 Mobile Responsive | Optimized for all screen sizes | 5 |
| 💬 Private Messaging | Secure 1:1 messaging system between users | ✓ |
| 🏆 Achievement Section | Showcase milestones, recognitions, awards | ✓ |
| 🔗 LinkedIn Integration | Planned feature for syncing user profiles with LinkedIn | ✓ |

---

## 📁 Project Structure

```bash
AlumniVerse/
│
├── frontend/           # Next.js + TypeScript client app
│   ├── pages/
│   ├── components/
│   └── styles/
│
├── backend/            # Node.js + Express server
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── config/
│
└── README.md
```

---

## 🔐 Environment Variables

### Backend `.env` (Required)
```
PORT=
JWT_SECRET=
CORS_ALLOWED_ORIGINS=
MONGO_URI=

# Cloudinary
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
CLOUDINARY_URL=
```

> ⚠️ Make sure to create a `.env` file in the backend directory and do not commit this to version control.

---

## 🛠️ Getting Started Locally

### 🧪 Prerequisites
- Node.js ≥ 16.x
- MongoDB or a MongoDB Atlas cluster
- Cloudinary account for media storage

### 📦 Installation

```bash
git clone https://github.com/unicorn004/AlumniVerse.git
cd AlumniVerse
```

Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../server
npm install
```

### 🏃 Running the Project

Start the backend server:
```bash
cd server
npm start
```

Start the frontend dev server:
```bash
cd ../frontend
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

---

## 📌 Future Enhancements

- 🔗 LinkedIn profile integration
- 📧 Email notifications for messages & updates
- 📊 Admin dashboard and analytics
- 🗓️ Alumni event calendar
- 🔒 Role-based access (Admin/Student/Alumni)

---

## 🤝 Contributing

We welcome contributions! Fork the repo, make your changes in a new branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
