import React, { useState } from "react";
import axios from "axios";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentLoans = ({ loans, setLoans }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // Open and close modal
  const openModal = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };

  // Handle approve/reject
  const handleStatusUpdate = async (status) => {
    try {
      await axios.put(
        `http://localhost:4000/api/loans/loanRepayment${selectedLoan.loan_id}/status`, 
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Loan ${status} successfully!`);
      closeModal();

      // Refresh the loans list
      const res = await axios.get("http://localhost:4000/api/loans/filter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(res.data.loans || []);
    } catch (error) {
      console.error("Error updating loan status:", error);
      alert("Failed to update loan status. Please try again.");
    }
  };

  return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Recent Loans</h2>
          <button
            onClick={() => navigate("/admin/AllLoans")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition-colors"
          >
            View All
          </button>
      </div>


      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
          <span className="text-3xl mb-2">📊</span>
          <p>No loan records available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Loan ID</th>
                <th className="py-2">Member ID</th>
                <th className="py-2">Username</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.slice(0, 5).map((loan) => (
                <tr key={loan.loan_id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{loan.loan_id}</td>
                  <td className="py-2">{loan.user_id}</td>
                  <td className="py-2">{loan.user.userName}</td>
                  <td className="py-2">KSh {loan.amount}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
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
                  <td className="text-center">
                    {loan.status === "pending" ? (
                      <button
                        onClick={() => openModal(loan)}
                        className="flex items-center gap-1 text-blue-600 hover:underline mx-auto"
                      >
                        <Eye size={16} /> Review
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-1 text-gray-400 cursor-not-allowed mx-auto"
                      >
                        <Eye size={16} /> Reviewed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Review Loan</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Loan ID:</strong> {selectedLoan.loan_id}</p>
              <p><strong>Member ID:</strong> {selectedLoan.user_id}</p>
              <p><strong>Amount:</strong> KSh {selectedLoan.amount}</p>
              <p><strong>Status:</strong> {selectedLoan.status}</p>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => handleStatusUpdate("approved")}
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                <XCircle size={16} /> Decline
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentLoans;
