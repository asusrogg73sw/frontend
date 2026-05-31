// src/App.tsx
import { Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "./store/hooks"; // Redux state check karne ke liye
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();
  
  // 1. Check karein kya user logged in hai aur admin hai?
  const { userInfo } = useAppSelector((state) => state.auth);
  const isAdmin = userInfo && userInfo.isAdmin;

  // 2. Conditions check karein
  const isLoginPage = location.pathname === '/login';
  
  // Sidebar sirf tab dikhana hai jab login page na ho AUR user Admin ho 👑
  const showSidebar = !isLoginPage && isAdmin;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* 🌐 NEW FIX: !isLoginPage ka check hata diya taake Navbar login page par bhi hamesha top par show ho */}
      <Navbar />
      
      <div className="flex flex-1">
        {/* 🎛️ Sidebar: Ye sirf Admin ko dikhega */}
        {showSidebar && <Sidebar />}
        
        {/* 📦 Main Content Area */}
        <main className={`flex-1 overflow-y-auto ${showSidebar ? 'p-8' : 'p-4 md:p-8 max-w-7xl mx-auto w-full'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;