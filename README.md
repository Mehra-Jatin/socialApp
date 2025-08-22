# 💬 MERN Real-Time Chat App
**full-stack real-time chat application** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).
## 🚀 Features

- 🔐 **JWT-based Authentication** – Secure login and registration with JSON Web Tokens  
- 💬 **Real-time Messaging** – Powered by **Socket.IO** for instant communication  
- 💾 **Persistent Chat History** – All messages are stored in **MongoDB**  
- 🖼️ **Image Sharing via Cloudinary** – Upload and send images in chat  
- 🧠 **Zustand** – Lightweight and fast global state management  
- 💅 **TailwindCSS + DaisyUI** – Responsive and beautiful UI with minimal effort  
- 🔔 **React Hot Toast** – Non-intrusive toast notifications for actions and status updates  
- ⚡ **Socket-Based Presence** – Shows which users are online and manages connections in real time

---

## 🔗 Live Demo 

https://social-app-omega-six.vercel.app/

>⚠️ **Note:** It may take **a few seconds to load** the app as the backend is hosted on **Render**, which **spins down the server after 15 minutes of inactivity**.
>- open the link in 2 diffrent browser incognito dosen't support third party cookies 
---
## 🧪 Test Credentials

You can use the following credentials to explore the platform:  

- **Email**: karan123@gmail.com  
- **Password**: karan123
- 
- **Email**: uttkarsh123@example.com 
- **Password**: uttkarsh123   


## 🛠 Tech Stack

### 🧠 Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO (real-time communication)
- Cloudinary (for image uploads)
- JWT for authentication

### 🎨 Frontend
- React.js (Vite)
- TailwindCSS + DaisyUI (UI library)
- Zustand (state management)
- Axios (HTTP client)
- React Hot Toast (notifications)
- Socket.IO Client

---

## 🌐 Environment Variables

### 🔐 Backend `.env` 

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173

```

### 🌍 Frontend .env

```
VITE_SERVER_URL=http://localhost:5000
```

## 💻 Getting Started

### 1️⃣ Clone the Repository

```
git clone https://github.com/Mehra-Jatin/socialApp.git
cd socialApp
```
### 2️⃣ Setup Backend
```
cd backend
npm install
touch .env  # Add your environment variables
npm run dev
```
### 3️⃣ Setup Frontend
```
cd ../frontend
npm install
touch .env  # Add your VITE_SERVER_URL
npm run dev
```

## 👨‍💻 Author

**Jatin Mehra**  
[GitHub – @Mehra-Jatin](https://github.com/Mehra-Jatin)
