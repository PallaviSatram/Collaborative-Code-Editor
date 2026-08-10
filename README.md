# 🚀 SyncCode

> A real-time collaborative code editor built with React.js, Node.js, Express.js, PostgreSQL, Socket.IO, and JWT Authentication.

SyncCode enables multiple developers to collaborate in real time by joining shared rooms, writing code together, and synchronizing code changes instantly. It provides secure authentication, persistent room storage, participant tracking, and a scalable backend architecture.

---

## ✨ Features

### 👨‍💻 Real-Time Collaboration

- Real-time collaborative code editing
- Multiple users can join the same room
- Live code synchronization using Socket.IO
- Live programming language synchronization
- Auto-sync editor state when a new participant joins
- Participant tracking
- Real-time collaborator cursor movement
- Display collaborator username near their cursor
- Stable color assigned to each collaborator
- Collaborator cursor and username use the same color

---

### 📜 Version History

- Save the current code as a version
- View saved versions for the current room
- Version numbers follow a sequential order within each room
- View version details including:
  - Version number
  - Commit message
  - Author
  - Programming language
  - Saved code
  - Creation timestamp
- Version history is persisted in PostgreSQL
- Users can copy saved code for manual restoration

---

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password hashing using bcrypt
- Protected API Routes
- Protected Socket.IO Connections
- React Context API for authentication state

---

### 🗄 Database

- PostgreSQL integration
- Persistent room storage
- Persistent code storage
- Persistent language storage
- Persistent version history
- Room activity tracking
- Automatic cleanup of inactive rooms

---

### ⚙️ Backend Architecture

- Express.js REST APIs
- Layered Architecture
- Controllers
- Services
- Models
- Routes
- Middleware
- Socket Middleware
- Scheduler for inactive room cleanup
- Real-time Socket.IO event handling

---

### 🎨 Frontend

- React.js
- Context API
- React Router
- Axios
- React Hot Toast
- Responsive UI
- Dark Theme

---

## 🏗 Tech Stack

### Frontend

- React.js
- React Router DOM
- Socket.IO Client
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- Socket.IO
- JWT
- bcrypt

### Database

- PostgreSQL

### Tools

- Git
- GitHub
- VS Code

---

## 📂 Project Structure

```text
SyncCode
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── constants
│   │   └── utils
│   │
│   └── public
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── constants
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── scheduler
│   │   ├── services
│   │   └── sockets
│   │
│   └── server.js
│
└── README.md
```

---

## 🔄 Application Flow

```text
User
   │
   ▼
Login / Register
   │
   ▼
JWT Authentication
   │
   ▼
Home Dashboard
   │
   ▼
Join / Create Room
   │
   ▼
Socket.IO Connection
   │
   ▼
Collaborative Editor
```

---

## 🔐 Authentication Flow

```text
Register

↓

PostgreSQL

↓

Login

↓

JWT Token

↓

React Context

↓

Protected Routes

↓

Socket Authentication
```

---

## ⚡ Installation

### Clone Repository

```bash
git clone https://github.com/PallaviSatram/Collaborative-Code-Editor.git
```

---

### Backend

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=YOUR_POSTGRES_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY
```

Run:

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend

npm install
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

Run:

```bash
npm start
```

---

## 🚀 Future Enhancements

- Code Execution
- Recent Rooms Dashboard
- User Profiles
- Room Ownership
- Invite Links
- Chat System
- File Explorer
- Theme Customization
- Docker Deployment
- CI/CD Pipeline

---

## 📖 What I Learned

While building SyncCode, I gained hands-on experience with:

- Designing scalable backend architecture
- Real-time communication using Socket.IO
- JWT Authentication
- PostgreSQL integration
- REST API development
- React Context API
- WebSocket authentication
- Layered project structure
- State synchronization
- Git & GitHub workflows

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the project and submit a pull request.

---

## 👩‍💻 Author

**Pallavi Satram**

GitHub: https://github.com/PallaviSatram

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
