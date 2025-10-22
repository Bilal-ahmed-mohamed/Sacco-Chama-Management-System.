// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { Menu } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Members from "./Members";
import LoanApproval from "./LoansApproval";
import AllContribution from "./AllContribution";
import Reminder from "./Reminder";
import AdminSidebar from "../components/AdminSidebar"; 


const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = { userName: "Admin", role: "Super Admin" };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-gray-200 p-4 md:p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your Chama</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-medium">{user.userName}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {user.userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Routes */}
        <div className="p-4 md:p-8">
          <Routes>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/members" element={<Members />} />
            <Route path="/admin/loans" element={<LoanApproval />} />
            <Route path="/admin/contributions" element={<AllContribution />} />
            <Route path="/admin/reminders" element={<Reminder />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
