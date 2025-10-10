import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import axios from "axios";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [oldPassword , setOldPassword] = useState("");
  const [newPassword , setNewPassword] = useState("");
  const [confirmPassword , setConfirmPassword] = useState("");
  const [error , setError] = useState("");
  const [success, setSuccess] = useState("");




    // Handle form submission - validate and send to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 

    // Basic validation
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
      // Get token from localStorage (assuming you store it during login)
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      if (!token) {
        setError("You must be logged in to change password.");
        return;
      }

      // Send request to backend
      const response = await axios.put(
        "http://localhost:4000/api/users/change-password",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Optionally redirect after successful change
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (err) {
        console.error("Password change error:", err);
        if (err.response) {
        console.error("Backend responded with:", err.response.data);
        setError(err.response.data.message || "Failed to change password");
    } else {
        console.error("No response from server:", err.message);
        setError("Server not responding. Please try again later.");
    }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Change Password</h1>
            <p className="text-sm text-white/80 mt-1">Update your account password</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Security Settings Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              <p className="text-sm text-muted-foreground">Keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                 onChange={(e) => setOldPassword(e.target.value)}
                value={oldPassword}
                placeholder="Enter current password"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                required
                 onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Password Requirements Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Password Requirements:
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>At least 6 characters long</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Different from your current password</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use a mix of letters, numbers, and symbols for better security</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;