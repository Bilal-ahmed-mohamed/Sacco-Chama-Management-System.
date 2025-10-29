import { useState, useEffect } from "react";
import { Search, CreditCard, Plus, Download, Menu, X } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const ContributionsPage = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    member: "",
    driveCategory: "",
    singleDate: "",
    dateRange: ""
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      if (!token) {
        console.error("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:4000/api/contributions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const contribList = data.contributions || data || [];
      setContributions(contribList);
      const total = contribList.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
      setTotalAmount(total);
      setTotalEntries(contribList.length);
    } catch (error) {
      console.error("Error fetching contributions:", error);
      setContributions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };



  const filteredContributions = contributions.filter((contrib) => {
  const searchTerm = filters.search.toLowerCase();

  if (filters.search) {
    const userName = contrib.user?.userName?.toLowerCase() || "";
    const phone = contrib.phone?.toLowerCase() || "";
    const notes = contrib.notes?.toLowerCase() || "";
    const category = contrib.category?.toLowerCase() || "";
    const amount = contrib.amount?.toString() || "";
    const date = new Date(contrib.date || contrib.contribution_date)
      .toLocaleDateString()
      .toLowerCase();

    // Search matches if any field contains the term
    const matches =
      userName.includes(searchTerm) ||
      phone.includes(searchTerm) ||
      notes.includes(searchTerm) ||
      category.includes(searchTerm) ||
      amount.includes(searchTerm) ||
      date.includes(searchTerm);

    if (!matches) return false;
  }

  if (filters.member && contrib.user_id !== filters.member) return false;
  if (filters.driveCategory && contrib.category !== filters.driveCategory) return false;

  return true;
});


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />



      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          
          <button onClick={() => setMenuOpen(true)} className="md:hidden text-gray-700">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Contributions</h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Contributions</h1>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
              <CreditCard className="h-4 w-4" />
              Pay via M-Pesa
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Plus className="h-4 w-4" />
              Add Contribution
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden overflow-x-auto gap-2 pb-3 mb-4 scrollbar-hide">
          <button className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
            <CreditCard className="h-4 w-4" />
            M-Pesa
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Plus className="h-4 w-4" />
            Add
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Total Contributions */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <p className="text-sm text-gray-600 mb-1">Total Contributions</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Ksh {totalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">From {totalEntries} entries</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member</label>
              <select
                value={filters.member}
                onChange={(e) => handleFilterChange("member", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">Filter by member...</option>
                <option value="1">Member 1</option>
                <option value="2">Member 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.driveCategory}
                onChange={(e) => handleFilterChange("driveCategory", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">Filter by category...</option>
                <option value="monthly">Monthly</option>
                <option value="special">Special Drive</option>
                <option value="emergency">Emergency Fund</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Single Date</label>
              <input
                type="date"
                value={filters.singleDate}
                onChange={(e) => handleFilterChange("singleDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input
                type="text"
                placeholder="Pick date range..."
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredContributions.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow-sm border border-gray-100">
              No data found.
            </div>
          ) : (
            filteredContributions.map((contrib, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                    {(contrib.member_name || contrib.userName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">
                      {contrib.user?.userName || contrib.userName || `User ${contrib.user_id}`}
                    </p>
                    <p className="text-xs text-gray-500">{contrib.phone || "N/A"}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600 flex-shrink-0">
                    Ksh {parseFloat(contrib.amount || 0).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-gray-900">{contrib.category || "General"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-gray-900">
                      {new Date(contrib.date || contrib.contribution_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="text-gray-900 truncate">{contrib.notes || "-"}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button className="text-blue-600 hover:underline text-sm font-medium">
                    View Details
                  </button>
                </div>
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
                  {["Member", "Phone", "Amount", "Category", "Date", "Notes", "Created", "Actions"].map((title) => (
                    <th key={title} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredContributions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  filteredContributions.map((contrib, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                            {(contrib.member_name || contrib.userName || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="font-medium text-gray-900">
                            {contrib.user?.userName || contrib.userName || `User ${contrib.user_id}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{contrib.phone || "N/A"}</td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-green-600">
                          Ksh {parseFloat(contrib.amount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {contrib.category || "General"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(contrib.date || contrib.contribution_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{contrib.notes || "-"}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(contrib.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-blue-600 hover:underline text-sm">View</button>
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
  );
};

export default ContributionsPage;