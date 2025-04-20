
# 🎓 Alumni Connect Portal

The **Alumni Connect Portal** is a full-stack web application built to connect alumni and current students through a centralized platform. It facilitates networking, mentorship, and knowledge sharing within the institution's community. Users can maintain professional profiles, share updates, highlight achievements, and engage in real-time conversations.

---

## 🌐 Live Demo

- **Frontend**: [Hosted on Vercel](https://alumni-verse-two.vercel.app/)
- **Backend**: [Hosted on Render (API-based access)](https://alumniverse.onrender.com)

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

- 🔐 Secure login/signup with JWT authentication
- 🧑‍🎓 Rich alumni and student profile management
- 📝 Community feed with image/text posts, likes, dislikes & comments
- 🏆 Achievement section to highlight awards, milestones, and recognitions
- 🔍 Search & filter alumni by batch, branch, job title, or location
- 💬 Private messaging using Socket.IO
- ☁️ Cloudinary integration for image and resume uploads
- 📱 Fully responsive mobile-first design

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

## 🔐 Environment Variables

### Backend .env (Required)
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

Make sure to create a .env file in the backend/ directory and add the above variables. Never commit this file to version control.

---

## 🛠️ Getting Started Locally

### 🧪 Prerequisites
- Node.js ≥ 16.x
- MongoDB or a MongoDB Atlas cluster
- A Cloudinary account for media storage

### 📦 Installation

Clone the repository:
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
cd backend
npm start
```

Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

Now you can access the application at http://localhost:3000.

---

## 📌 Future Enhancements

- 🔗 LinkedIn profile integration
- 📧 Email notifications for messages & updates
- 📊 Admin dashboard and analytics
- 🗓️ Alumni event calendar

---

## 🤝 Contributing

We welcome contributions from the community. Please fork the repo, create a new branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
