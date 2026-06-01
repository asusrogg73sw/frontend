// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks"; 
import API from "../api/axios";

const ProfilePage = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const payload: any = { name, email };
      if (password) {
        payload.password = password;
      }

      await API.put("/users/profile", payload);

      setSuccess(true);
      setPassword("");
      setConfirmPassword(""); // 🚀 NEW FIX: Changed confirmPassword("") to setConfirmPassword("") function expression
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Profile</h2>
      
      {message && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-xl">{message}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-xl">Profile Updated Successfully!</div>}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave blank to keep same"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;