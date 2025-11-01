import React, { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, Wallet, DollarSign, CreditCard, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Transactions", path: "/transactions", icon: Wallet },
    { title: "Contributions", path: "/contribution", icon: DollarSign },
    { title: "Loans", path: "/loans", icon: CreditCard },
    { title: "Repayments", path: "/loanPayment", icon: CreditCard },
    { title: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      <aside
        className={`${
          isOpen ? "fixed inset-y-0 left-0 z-50" : "hidden"
        } md:block md:relative w-64 bg-white border-r border-gray-200 h-full`}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Sacco Portal</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4">
          {menuItems.map(({ path, title, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 p-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg bg-red-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* dark overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
