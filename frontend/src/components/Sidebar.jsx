import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Transactions", path: "/transactions" },
    { title: "Contributions", path: "/contribution" },
    { title: "Loans", path: "/loans" },
    { title: "Repayments", path: "/loanPayment" },
    { title: "Members", path: "/members" },
    { title: "Profile", path: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between z-40 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* --- Top Section --- */}
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-blue-700">Sacco</h1>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>

          <nav className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Main</div>
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "hover:bg-blue-50 hover:text-blue-600 text-gray-700"
                  }`
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* --- Bottom Section: Logout --- */}
        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg bg-red-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
