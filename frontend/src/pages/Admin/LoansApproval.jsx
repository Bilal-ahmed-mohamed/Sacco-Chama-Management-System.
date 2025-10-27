import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Plus,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  Filter,
  Menu,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const MemberLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    member: "",
    status: "",
    startDateFrom: "",
    startDateTo: "",
  });

  const [stats, setStats] = useState({
    totalLoans: 0,
    totalAmount: 0,
    activeLoans: 0,
    activeBalance: 0,
    pendingApproval: 0,
    overdueLoans: 0,
  });

  // fetch on mount
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);

      // Build query params
      const query = new URLSearchParams();
      if (filters.status) query.append("status", filters.status);
      if (filters.member) query.append("user_id", filters.member);
      if (filters.startDateFrom && filters.startDateTo) {
        query.append("startDate", filters.startDateFrom);
        query.append("endDate", filters.startDateTo);
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const response = await fetch(
        `http://localhost:4000/api/loans/filter?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      const loansList = data.loans || [];
      setLoans(loansList);

      // Calculate stats
      const total = loansList.length;
      const totalAmount = loansList.reduce(
        (sum, l) => sum + parseFloat(l.amount || 0),
        0
      );
      const active = loansList.filter((l) => l.status === "approved");
      const activeBalance = active.reduce(
        (sum, l) => sum + parseFloat(l.balance || 0),
        0
      );
      const pending = loansList.filter((l) => l.status === "pending").length;
      const overdue = loansList.filter((l) => l.status === "overdue").length;

      setStats({
        totalLoans: total,
        totalAmount,
        activeLoans: active.length,
        activeBalance,
        pendingApproval: pending,
        overdueLoans: overdue,
      });
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      member: "",
      status: "",
      startDateFrom: "",
      startDateTo: "",
    });
    fetchLoans();
  };

  const handleLoanAction = async (loanId, action) => {
    const confirmed = window.confirm(`Are you sure you want to ${action} this loan?`);
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/admin/loans/${loanId}/${action}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(`Loan ${action}ed successfully!`);
        fetchLoans();
      } else {
        alert(data.message || `Failed to ${action} loan.`);
      }
    } catch (error) {
      console.error(`Error ${action}ing loan:`, error);
      alert("Something went wrong. Please try again.");
    }
  };

  const filteredLoans = loans.filter((loan) => {
    if (filters.search && !loan.loan_id?.toLowerCase().includes(filters.search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm px-4 md:px-6 py-4 border-b border-gray-200 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Member Loans</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Plus className="h-4 w-4" />
              Add Loan
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Loan Statistics */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Loan Statistics</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-100 text-center">
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs md:text-sm text-gray-600">Total Loans</p>
                <p className="text-xl md:text-3xl font-bold text-blue-600">{stats.totalLoans}</p>
                <p className="text-xs text-gray-500">Ksh {stats.totalAmount.toLocaleString()}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-100 text-center">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs md:text-sm text-gray-600">Active Loans</p>
                <p className="text-xl md:text-3xl font-bold text-green-600">{stats.activeLoans}</p>
                <p className="text-xs text-gray-500">Ksh {stats.activeBalance.toLocaleString()}</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 md:p-4 border border-yellow-100 text-center">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-xs md:text-sm text-gray-600">Pending</p>
                <p className="text-xl md:text-3xl font-bold text-yellow-600">{stats.pendingApproval}</p>
              </div>

              <div className="bg-red-50 rounded-lg p-3 md:p-4 border border-red-100 text-center">
                <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-red-600 mx-auto mb-2" />
                <p className="text-xs md:text-sm text-gray-600">Overdue</p>
                <p className="text-xl md:text-3xl font-bold text-red-600">{stats.overdueLoans}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search loan ID..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="repaid">Repaid</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDateFrom}
                  onChange={(e) => handleFilterChange("startDateFrom", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.startDateTo}
                  onChange={(e) => handleFilterChange("startDateTo", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="mt-4">
              <button
                onClick={fetchLoans}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredLoans.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                No loans found
              </div>
            ) : (
              filteredLoans.map((loan, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Member</p>
                      <p className="font-semibold text-gray-900">
                        {loan.user.userName || `Member ${loan.user_id}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Loan ID: {loan.loan_id}</p>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        loan.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : loan.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : loan.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>

                  <div className="text-center py-3 mb-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">Loan Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      Ksh {parseFloat(loan.amount || 0).toLocaleString()}
                    </p>
                  </div>

                  {loan.status === "pending" && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleLoanAction(loan.loan_id, "approve")}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleLoanAction(loan.loan_id, "decline")}
                        className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Member</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Loan No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500">
                        No loans found
                      </td>
                    </tr>
                  ) : (
                    filteredLoans.map((loan, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {loan.user.userName || `Member ${loan.user_id}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{loan.loan_id}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          Ksh {parseFloat(loan.amount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              loan.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : loan.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : loan.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          {loan.status === "pending" ? (
                            <>
                              <button
                                onClick={() => handleLoanAction(loan.loan_id, "approve")}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleLoanAction(loan.loan_id, "decline")}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-500 text-sm">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberLoansPage;