import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import RecentLoans from "../components/RecentLoans";

const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    totalMembers: 0,
    totalLoans: 0,
    totalContributions: 0,
    pendingLoans: 0,
  });

  const [loans, setLoans] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch members, loans, contributions in parallel
        const [membersRes, loansRes, contributionsRes] = await Promise.all([
          axios.get("http://localhost:4000/api/users/total-members", { headers }),
          axios.get("http://localhost:4000/api/loans/filter", { headers }),
          axios.get("http://localhost:4000/api/contributions/", { headers }),
        ]);

        const membersList = membersRes.data.members || [];
        const loansList = loansRes.data.loans || [];
        const contributionsList = contributionsRes.data.contributions || [];

        const totalLoans = loansList.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
        const totalContributions = contributionsList.reduce(
          (sum, c) => sum + (parseFloat(c.amount) || 0),
          0
        );
        const pendingLoans = loansList.filter((l) => l.status === "pending").length;

        setLoans(loansList);
        setContributions(contributionsList);
        setStats({
          totalMembers: membersList.length, // <-- only added this
          totalLoans,
          totalContributions,
          pendingLoans,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="md:hidden text-gray-700">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm md:text-base">
                Manage members, loans, and contributions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-gray-600 font-medium">{user?.userName}</p>
              <p className="text-gray-500 text-sm">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              {user?.userName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

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
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {[
                { label: "Total Members", value: stats.totalMembers },
                { label: "Total Loans", value: `KSh ${stats.totalLoans}` },
                { label: "Total Contributions", value: `KSh ${stats.totalContributions}` },
                { label: "Pending Loans", value: stats.pendingLoans },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 flex flex-col justify-between"
                >
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{card.label}</h3>
                  <p className="text-2xl font-bold text-blue-700">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Loans */}
            <RecentLoans loans={loans} setLoans={setLoans} />

            {/* Recent Contributions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Contributions</h2>
              </div>

              {contributions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <span className="text-3xl mb-2">💰</span>
                  <p>No contribution records available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Contribution ID</th>
                        <th className="py-2">Member ID</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Method</th>
                        <th className="py-2">Transaction ID</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributions.slice(0, 5).map((c) => (
                        <tr key={c.contributions_id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{c.contributions_id}</td>
                          <td className="py-2">{c.user_id}</td>
                          <td className="py-2">KSh {parseFloat(c.amount).toLocaleString()}</td>
                          <td className="py-2 capitalize">{c.method}</td>
                          <td className="py-2 text-gray-600">{c.transaction_id}</td>
                          <td className="py-2">
                            {new Date(c.date).toLocaleDateString("en-KE", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
