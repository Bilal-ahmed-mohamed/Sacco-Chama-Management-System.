import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Menu } from "lucide-react";
import axios from "axios";
import Sidebar from "../../components/Sidebar"; // ✅ import Sidebar

const ChangePassword = () => {
const navigate = useNavigate();

const [menuOpen, setMenuOpen] = useState(false);
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setSuccess("");

if (newPassword !== confirmPassword) {
  setError("New password and confirm password do not match.");
  return;
}
if (newPassword.length < 6) {
  setError("Password must be at least 6 characters long.");
  return;
}
if (newPassword === oldPassword) {
  setError("New password must be different from current password.");
  return;
}

try {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  if (!token) {
    setError("You must be logged in to change password.");
    return;
  }

  const response = await axios.put(
    "http://localhost:4000/api/users/change-password",
    { oldPassword, newPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.data.success) {
    setSuccess(response.data.message || "Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => navigate("/profile"), 2000);
  }
} catch (err) {
  console.error("Password change error:", err);
  if (err.response) {
    setError(err.response.data.message || "Failed to change password");
  } else {
    setError("Server not responding. Please try again later.");
  }
}

};

return ( <div className="flex h-screen bg-gray-100 text-gray-800">
{/* Sidebar */} <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

  {/* Main Content */}
  <main className="flex-1 overflow-y-auto p-4 md:p-8">
    {/* Header / Top Bar */}
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-gray-700"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Change Password</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Update your account password
          </p>
        </div>
      </div>
    </div>

    {/* Password Change Form */}
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-border rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Security Settings
            </h2>
            <p className="text-sm text-muted-foreground">
              Keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
        <h3 className="text-sm font-semibold mb-3">Password Requirements:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• At least 6 characters long</li>
          <li>• Different from your current password</li>
          <li>
            • Use a mix of letters, numbers, and symbols for better security
          </li>
        </ul>
      </div>
    </div>
  </main>
</div>


);
};

export default ChangePassword;
