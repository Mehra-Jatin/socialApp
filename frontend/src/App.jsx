import Navbar from './components/Navbar.jsx';
import { BrowserRouter as Router, Route, Routes , Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import {  useEffect } from 'react';
import { Loader } from 'lucide-react';
import  {Toaster} from "react-hot-toast";




function App() {

   const {authUser , checkAuth , isCheckingAuth} = useAuthStore();
   


   useEffect(() => {
     checkAuth();
   }, [checkAuth]);

   console.log(authUser);
   console.log(import.meta.env.VITE_SERVER_URL);
   if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
         <Loader className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
   }

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ?<HomePage/>:<Navigate to="/login"/>} />
          <Route path="/signup" element={!authUser ? <SignUpPage/>: <Navigate to="/"/> } />
          <Route path="/login" element={!authUser ?<LoginPage/>: <Navigate to="/"/>} />
           <Route path="/settings" element={<SettingsPage/>} />
            <Route path="/profile" element={authUser ?<ProfilePage/>:<Navigate to="/login"/>} />
        </Routes>
      </Router>
      <Toaster/>
    </div>
  )
}

export default App

