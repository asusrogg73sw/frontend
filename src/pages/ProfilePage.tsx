// src/pages/ProfilePage.tsx
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { User, Mail, MapPin, Phone, Lock, Save } from "lucide-react";
import API from "../api/axios";

const ProfilePage = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  
  // Local Input States
  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Backend user profile profile session load effect logic if details exist
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get("/users/profile"); // Aapka user profile profile endpoint
        if (response.data) {
          setPhone(response.data.phone || "");
          setAddress(response.data.address || "");
        }
      } catch (err) {
        console.log("Profile data load error", err);
      }
    };
    if (userInfo) fetchUserProfile();
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setMessage("");

    try {
      setLoading(true);
      // Put user parameters mapped safely
      const payload = { name, email, phone, address, ...(password && { password }) };
      const response = await API.put("/users/profile", payload);
      
      // Agar backend se raw response successful aaye
      setMessage("Profile successfully updated! ✨");
      setPassword(""); // Clear field boundary
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong saving database records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">My Personal Profile</h2>
        <p className="text-gray-400 text-xs">Update your shipping coordinates, secure identity details, and login sessions.</p>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-xl text-xs font-bold ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={16} />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
            <input type="text" value={phone} placeholder="+92 300 1234567" onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Delivery Shipping Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Default Shipping Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
            <textarea value={address} placeholder="Street, Sector/Area, City, Province" onChange={(e) => setAddress(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[70px] resize-none" />
          </div>
        </div>

        {/* Update Authentication Security */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">New Password (Leave blank to keep current)</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
            <input type="password" value={password} placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm">
          <Save size={14} />
          {loading ? "Saving Changes..." : "Update Settings Profiles"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;