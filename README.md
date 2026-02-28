
Taskly is a full-stack task management application built with the MERN stack.  
It provides secure authentication and an intuitive dashboard for managing tasks efficiently.


```
Features:
```
1)User Authentication (Login / Register) 
2)Task Creation & Management
3)Modern Dashboard UI
4)Search Functionality
5)Protected Routes with JWT Authentication



**Tech Stack:**

###Frontend
- React.js (Vite)
- Tailwind CSS

###Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## 📁 Project Structure

SecureTaskManagement/
├── Backend/
│   ├── controller/
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── taskModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   └── package.json
│
└── Frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/
        │   └── axios.jsx
        ├── assets/
        │   └── react.svg
        ├── components/
        │   ├── SidebarBtn.jsx
        │   ├── StatCard.jsx
        │   ├── StatusBadge.jsx
        │   └── TaskCard.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   └── auth.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── utils/
        │   └── token.jsx
        ├── App.jsx
        ├── main.jsx
        └── index.css
```


##  Architecture Diagram

<p align="center">
  <img src="./assets/image.png" width="800"/>
</p>


## Installation

### Clone Repository
git clone https://github.com/bharathraj49/Secure_Task_Management_Dashboard.git
cd SECURETASKMANAGEMENT

### Backend Setup
cd Backend
npm install
npm start

### Frontend Setup
cd Frontend
cd src
npm install
npm run dev

## Environment Variables

Create a `.env` file inside Backend:

MONGO_URI=mongodb+srv://bharath:Bharath@cluster0.1gkorum.mongodb.net/SecureTaskManagementDashboard
PORT=5010
SECRET_KEY=your_secret_key


Developed By
Bharath Raj T