import { useState, useEffect } from "react";
import { Eye, Menu } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        const response = await fetch("http://localhost:4000/api/loans/filter?", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setLoans(data.loans);
        }
      } catch (error) {
        console.error("Error fetching all loans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      <div className="flex-1 p-4 md:p-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden mb-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        <h1 className="text-xl md:text-2xl font-semibold mb-6">All Loans</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 bg-white rounded-lg shadow-sm">
            <span className="text-3xl mb-2">📊</span>
            <p className="text-sm md:text-base">No loan records found</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan.loan_id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Loan ID</p>
                      <p className="font-semibold text-gray-900">{loan.loan_id}</p>
                      <p className="text-xs text-gray-500 mt-2">Member</p>
                      <p className="font-medium text-gray-900">
                        {loan.User?.name || `Member ${loan.user_id}`}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        loan.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : loan.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : loan.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>

                  <div className="text-center py-3 mb-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">Loan Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      KSh {parseFloat(loan.amount).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => console.log("Review loan", loan.loan_id)}
                      className="w-full flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors font-medium"
                    >
                      <Eye size={16} /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 font-semibold text-gray-700">Loan ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Member ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Username</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loans.map((loan) => (
                    <tr key={loan.loan_id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{loan.loan_id}</td>
                      <td className="py-3 px-4">{loan.user_id}</td>
                      <td className="py-3 px-4">{loan.User?.name || `Member ${loan.user_id}`}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">
                        KSh {parseFloat(loan.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            loan.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : loan.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : loan.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <button
                          onClick={() => console.log("Review loan", loan.loan_id)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllLoans;