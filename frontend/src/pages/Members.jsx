import { useState, useEffect } from "react";
import { Search, Users, ChevronDown, Menu } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar"; // adjust path if needed

const MembersPage = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [members, setMembers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/admin/members");
      const data = await response.json();
      const membersList = data.members || [];
      setMembers(membersList);

      setPendingCount(membersList.filter((m) => m.status === "pending").length);
      setApprovedCount(membersList.filter((m) => m.status === "approved").length);
      setRejectedCount(membersList.filter((m) => m.status === "rejected").length);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (memberId) => {
    try {
      await fetch(`http://localhost:4000/api/admin/members/${memberId}/approve`, {
        method: "POST",
      });
      fetchMembers();
    } catch (error) {
      console.error("Error approving member:", error);
    }
  };

  const handleReject = async (memberId) => {
    try {
      await fetch(`http://localhost:4000/api/admin/members/${memberId}/reject`, {
        method: "POST",
      });
      fetchMembers();
    } catch (error) {
      console.error("Error rejecting member:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden mb-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        <div className="max-w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Members</h1>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-t-lg border-b border-gray-200 mb-6">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab("members")}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === "members"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Members</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm">
                    {members.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === "pending"
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Pending Approval</span>
                  <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-sm">
                    {pendingCount}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-orange-500">{pendingCount}</span>
                <span className="text-gray-600 mt-2">Pending Approval</span>
                <span className="text-sm text-gray-400 mt-1">Awaiting approval</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-green-500">{approvedCount}</span>
                <span className="text-gray-600 mt-2">Approved</span>
                <span className="text-sm text-gray-400 mt-1">Successfully approved</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-red-500">{rejectedCount}</span>
                <span className="text-gray-600 mt-2">Rejected</span>
                <span className="text-sm text-gray-400 mt-1">Rejected applications</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Additional Data
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id || member.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                              {(member.name || member.userName || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {member.name || member.userName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {member.id || member.user_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{member.email}</div>
                          <div className="text-sm text-gray-500">{member.phone || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              member.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : member.status === "pending"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(member.created_at || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {member.additionalData || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {member.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(member.id || member.user_id)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(member.id || member.user_id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button className="px-3 py-1 text-blue-600 text-sm hover:underline">
                              View Details
                            </button>
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

export default MembersPage;
