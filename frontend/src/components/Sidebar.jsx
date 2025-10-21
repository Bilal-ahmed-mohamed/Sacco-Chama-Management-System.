import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: "Dashboard" , path: "/dashboard"  },
    { title: "Transactions" },
    { title: "Contributions" , path: "/contribution " },
    { title: "Loans" , path: "/loans" },
    { title: "Repayments" , path: "/loanPayment" },
    { title: "Members" ,  },
    { title: "Profile" , path: "/profile" },
  ];

  const adminItems = [
    { title: "Bulk SMS" },
    { title: "Admin Management" },
  ];

  const settingItems = [
    { title: "Settings" },
    { title: "Documentation" },
  ];

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
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-6 flex flex-col z-40 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-blue-700">Sacco Admin</h1>
          <p className="text-sm text-gray-500">Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
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

          <div className="text-xs font-semibold text-gray-400 uppercase mt-6 mb-2">
            Administration
          </div>
          {adminItems.map((item) => (
            <button
              key={item.title}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {item.title}
            </button>
          ))}

          <div className="text-xs font-semibold text-gray-400 uppercase mt-6 mb-2">
            Settings
          </div>
          {settingItems.map((item) => (
            <button
              key={item.title}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {item.title}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
