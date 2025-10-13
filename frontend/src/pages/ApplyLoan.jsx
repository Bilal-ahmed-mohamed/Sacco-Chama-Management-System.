import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Wallet } from "lucide-react";
import axios from "axios";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [amount, setLoanAmount] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;
  const token = user?.token;

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
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

      // ✅ Send data to backend
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-6 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Apply for a Loan</h1>
            <p className="text-sm text-white/80 mt-1">
              Request a loan from your SACCO
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          {/* Loan Type */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Loan Type
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-4 text-lg font-medium bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Loan Amount
            </label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg font-medium bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Issued Date */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Issued Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                max={today}
                className="w-full pl-12 pr-4 py-4 text-lg font-medium bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={issuedDate || today}
                className="w-full pl-12 pr-4 py-4 text-lg font-medium bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
            className="w-full py-4 text-base font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLoan;
