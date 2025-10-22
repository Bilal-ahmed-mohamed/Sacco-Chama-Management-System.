import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const UserDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalContributions: 0,
    today: 0,
    thisMonth: 0,
  });
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ userName: "", role: "" });

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      return {
        id: user?.id || user?.user_id || user?.userId,
        userName: user?.userName || "Admin",
        role: user?.role || "Super Admin",
      };
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return { id: null, userName: "Admin", role: "Super Admin" };
    }
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser({ userName: userInfo.userName, role: userInfo.role });

    if (!userInfo.id) {
      setLoading(false);
      setError("User not logged in");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching data for user ID:", userInfo.id);

        // Fetch contributions with error handling
        let contributions = [];
        try {
          const { data: contribData } = await axios.get( 
            `http://localhost:4000/api/contributions/${userInfo.id}`
          );
          contributions = contribData.contribution || [];
          console.log("Contributions fetched:", contributions.length);
        } catch (contribError) {
          console.error("Error fetching contributions:", contribError);
          // Don't fail completely, just log and continue
        }

        // Fetch loans with error handling
        let loansData = [];
        try {
          const { data: loanData } = await axios.get(
            `http://localhost:4000/api/loans/repayments/${userInfo.id}`
          );
          loansData = loanData.loans || [];
          console.log("Loans fetched:", loansData.length);
        } catch (loanError) {
          console.error("Error fetching loans:", loanError.response?.status, loanError.message);
          // Check if it's a 404 specifically
          if (loanError.response?.status === 404) {
            console.log("No loans found for user");
            loansData = [];
          } else {
            throw loanError; // Re-throw if it's a different error
          }
        }

        const total = contributions.reduce(
          (sum, c) => sum + parseFloat(c.amount || 0),
          0
        );

        const today = contributions
          .filter(
            (c) =>
              new Date(c.date).toDateString() === new Date().toDateString()
          )
          .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

        const thisMonth = contributions
          .filter((c) => {
            const d = new Date(c.date);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

        setStats({ totalContributions: total, today, thisMonth });
        setLoans(loansData);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); //  Empty dependency array - only runs once on mount

  // Total Loan = remaining balance of the active loan
  const totalRemainingLoan = loans.reduce(
      (sum, loan) => sum + parseFloat(loan.remaining || 0),
      0
    );


  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-gray-700"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500 text-sm md:text-base">
                Welcome back! Here's what's happening.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-gray-600 font-medium">{user.userName}</p>
            
            </div>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              {user.userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              {
                label: "Total Contributions",
                value: `KSh ${stats.totalContributions.toLocaleString()}`,
              },
              { label: "Today", value: `KSh ${stats.today.toLocaleString()}` },
              {
                label: "This Month",
                value: `KSh ${stats.thisMonth.toLocaleString()}`,
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 flex flex-col justify-between"
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {card.label}
                </h3>
                <p className="text-2xl font-bold text-blue-700">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Loan Summary</h2>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                View All →
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading loans...</p>
            ) : loans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <span className="text-3xl mb-2">📉</span>
                <p>No active loans</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Loan ID</th>
                      <th className="py-2">Total Amount</th>
                      <th className="py-2">Paid</th>
                      <th className="py-2">Remaining</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2">{loan.loan_id}</td>
                        <td className="py-2">KSh {parseFloat(loan.totalAmount || 0).toLocaleString()}</td>
                        <td className="py-2 text-green-600">KSh {parseFloat(loan.totalPaid || 0).toLocaleString()}</td>
                        <td className="py-2 text-red-600 font-semibold">KSh {parseFloat(loan.remaining || 0).toLocaleString()}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            loan.status === 'repaid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Total Loan Remaining */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center">
            <h2 className="text-lg font-semibold mb-4">Total Loan Remaining</h2>
            <p className="text-3xl font-bold text-red-600">
              KSh {totalRemainingLoan.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">{loans.length} active loan(s)</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;