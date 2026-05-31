// src/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Users, LogOut, ShoppingBagIcon, Package } from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { logoutUser } from "../store/authSlice";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Logout from Admin Panel?")) {
      dispatch(logoutUser());
    }
  };

  const isActive = (path: string) => 
    location.pathname === path 
      ? "bg-blue-600 text-white" 
      : "text-gray-400 hover:bg-gray-800 hover:text-white";

  return (
    <div className="w-64 bg-gray-950 text-white min-h-screen p-4 flex flex-col border-r border-gray-800 shadow-xl shrink-0">
      <div className="mb-10 px-2 pt-2">
        <h1 className="text-xl font-black tracking-wider text-white">PRO<span className="text-blue-500">ADMIN</span></h1>
        <p className="text-xs text-gray-500 mt-1">Management Desk</p>
      </div>

      <nav className="flex-1 space-y-1">
        {/* 📊 1. Real Dashboard (Stats/Analytics) */}
        <Link to="/admin/dashboard" className={`flex items-center space-x-3 p-3 rounded-xl transition font-medium ${isActive("/admin/dashboard")}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        {/* 📦 2. Products Inventory (CRUD Table/Grid Switch) */}
        <Link to="/admin/products" className={`flex items-center space-x-3 p-3 rounded-xl transition font-medium ${isActive("/admin/products")}`}>
          <Package size={20} />
          <span>Products Inventory</span>
        </Link>
        
        {/* 👥 3. User List */}
        <Link to="/admin/users" className={`flex items-center space-x-3 p-3 rounded-xl transition font-medium ${isActive("/admin/users")}`}>
          <Users size={20} />
          <span>Users List</span>
        </Link>

        {/* 📦 4. Total Shop Orders (Command Center) */}
        <Link to="/admin/orders" className={`flex items-center space-x-3 p-3 rounded-xl transition font-medium ${isActive("/admin/orders")}`}>
          <ShoppingBagIcon size={20} />
          <span>All Orders</span>
        </Link>
      </nav>

      {/* Live Shop redirection path */}
      <div className="border-t border-gray-800 pt-4 mb-2">
        <Link to="/" className="flex items-center space-x-3 p-3 rounded-xl text-sm font-medium text-blue-400 hover:bg-blue-950/40 transition">
          <ShoppingBag size={18} />
          <span>Go to Live Shop</span>
        </Link>
      </div>

      <button onClick={handleLogout} className="flex items-center space-x-3 p-3 text-red-400 hover:bg-red-950/30 rounded-xl transition mt-auto font-medium">
        <LogOut size={20} />
        <span>Logout Desk</span>
      </button>
    </div>
  );
};

export default Sidebar;