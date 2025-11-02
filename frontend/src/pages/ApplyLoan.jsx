import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Wallet, ArrowLeft } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // ✅ adjust path as needed

const ApplyLoan = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [reason, setReason] = useState("");
  const [amount, setLoanAmount] = useState("");
  const [issuedDate, setIssuedDate] = useState(today); 
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;
  const token = user?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason || !amount || !issuedDate || !dueDate) {
      setMessage("All fields are required");
      return;
    }

    if (!user_id) {
      setMessage("User not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:4000/api/loans/apply",
        {
          user_id,
          reason,
          amount,
          issued_date: issuedDate,
          due_date: dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage("Loan application submitted successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage(response.data.message || "Failed to submit loan.");
      }
    } catch (error) {
      console.error("Error submitting loan:", error);
      setMessage(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white border-r">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 mb-4 hover:underline"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Back
          </button>

          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Apply for a Loan
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loan Type */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">
                Loan Type
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-4 text-lg font-medium bg-white border rounded-xl focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="">Select Loan Type</option>
                <option value="personal">Personal Loan</option>
                <option value="emergency">Emergency Loan</option>
                <option value="development">Development Loan</option>
                <option value="school">School Fees Loan</option>
              </select>
            </div>

            {/* Loan Amount */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">
                Loan Amount
              </label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg font-medium border rounded-xl focus:ring-2 focus:ring-blue-200"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Issued Date */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">
                Issued Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                <input
                  type="date"
                  value={issuedDate}
                  onChange={(e) => setIssuedDate(e.target.value)}
                  max={today}
                  className="w-full pl-12 pr-4 py-4 text-lg font-medium border rounded-xl focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={issuedDate || today}
                  className="w-full pl-12 pr-4 py-4 text-lg font-medium border rounded-xl focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <p
                className={`text-center font-medium ${
                  message.toLowerCase().includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 text-base font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;
