
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar, Edit2, LogOut } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: "John Kamau",
    email: "john.kamau@email.com",
    phone: "+254 712 345 678",
    memberId: "SACCO-2024-001",
    joinDate: "January 15, 2024",
    location: "Nairobi, Kenya",
  });

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center relative">
          <Link to="/dashboard" className="absolute left-4">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-semibold border border-primary/20">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-2xl font-semibold mt-4 text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Member ID: {user.memberId}
            </p>
            <button className="mt-4 px-4 py-2 border border-border rounded-md flex items-center gap-2 text-sm text-foreground hover:bg-muted transition-colors">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Personal Information
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">{user.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="text-sm font-medium text-foreground">{user.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Account Settings
          </h3>

          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors">
              <Link to="/change-password"> Change Password  </Link>
              </button>
            {["Change Password", "Notification Settings", "Privacy & Security", "Help & Support"].map(
              (item, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-lg bg-red-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

