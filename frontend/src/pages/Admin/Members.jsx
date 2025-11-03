import { useState, useEffect } from "react";
import { Search, Users, ChevronDown, Menu, Plus } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import AddMember from "../../components/AddMember";

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://sacco-chama-management-system.onrender.com/api/users/total-members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const membersList = data.members || [];
      setMembers(membersList);
      setActiveCount(membersList.filter((m) => m.status === "active").length);
      setInactiveCount(membersList.filter((m) => m.status === "inactive").length);
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden mb-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        <div className="max-w-full">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Users className="h-6 w-6 md:h-7 md:w-7 text-blue-600" /> Members
              </h1>
              <p className="text-gray-600 text-sm">
                Manage and review all members in the system.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="self-start md:self-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </div>

          {/* Add Member Modal */}
          <AddMember
            token={token}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onMemberCreated={() => fetchMembers()}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-blue-500">
                  {activeCount + inactiveCount}
                </span>
                <span className="text-gray-600 text-sm md:text-base mt-2">Total Members</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-green-500">{activeCount}</span>
                <span className="text-gray-600 text-sm md:text-base mt-2">Active Members</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-red-500">{inactiveCount}</span>
                <span className="text-gray-600 text-sm md:text-base mt-2">Inactive Members</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
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
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Members List - Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                No members found.
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id || member.user_id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                      {(member.name || member.userName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-base">
                        {member.name || member.userName}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{member.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {member.id || member.user_id}
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status || "Inactive"}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Joined: {new Date(member.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Members Table - Desktop View */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id || member.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                              {(member.name || member.userName || "U").charAt(0).toUpperCase()}
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
                        <td className="px-6 py-4 text-sm text-gray-500">{member.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              member.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status || "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(member.created_at || Date.now()).toLocaleDateString()}
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