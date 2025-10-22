// src/components/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import { Menu, Users, CheckCircle, DollarSign, Bell, X } from "lucide-react";

const AdminSidebar = ({ menuOpen, setMenuOpen }) => {
  const navItems = [
    { path: "/admin-dashboard", label: "Dashboard", icon: Menu },
    { path: "/admin/members", label: "Members", icon: Users },
    { path: "/admin/loans", label: "Approve Loans", icon: CheckCircle },
    { path: "/admin/contributions", label: "All Contributions", icon: DollarSign },
    { path: "/admin/reminders", label: "Loan Reminders", icon: Bell },
  ];

  return (
    <aside
      className={`${
        menuOpen ? "fixed inset-y-0 left-0 z-50" : "hidden"
      } md:block md:relative w-64 bg-white border-r border-gray-200 h-full`}
    >
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        <button onClick={() => setMenuOpen(false)} className="md:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="p-4">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
