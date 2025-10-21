import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { DollarSign, Calendar, Smartphone, CheckCircle, XCircle } from "lucide-react";

const LoanPayment = () => {
  const [loanData, setLoanData] = useState(null);
  const [formData, setFormData] = useState({ amount: "", phoneNumber: "", reference: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ✅ Get user details from localStorage dynamically
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user_id = storedUser?.user_id || storedUser?.id;
  const token = storedUser?.token;
  const userName = storedUser?.name || "User";

  // ✅ Fetch loan data safely
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/loans/repayments/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success && data.loans?.length > 0) {
          setLoanData(data.loans[0]);
        } else {
          setLoanData({
            loan_id: "N/A",
            totalAmount: 0,
            remaining: 0,
            due_date: "No active loan",
          });
          setMessage({ type: "info", text: "You currently have no active loans." });
        }
      } catch (err) {
        setLoanData({
          loan_id: "N/A",
          totalAmount: 0,
          remaining: 0,
          due_date: "No active loan",
        });
        setMessage({ type: "error", text: "Failed to fetch loan data." });
      }
    };

    fetchLoanData();
  }, [user_id, token]);

  // Handle form changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ type: "", text: "" });
  };

  //  Handle payment submission
  const handleSubmit = async () => {
    if (!formData.amount || !formData.phoneNumber) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setMessage({ type: "error", text: "Amount must be a positive number" });
      return;
    }

    if (!loanData || loanData.totalAmount === 0) {
      setMessage({ type: "error", text: "No active loan to make a repayment for." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/loans/loanRepayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          loan_id: loanData.loan_id,
          user_id: user_id,
          amount: parseFloat(formData.amount),
          date: new Date().toISOString(),
          method: "M-Pesa",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: data.message || "Payment recorded successfully!" });
        setLoanData({
          ...loanData,
          totalPaid: (loanData.totalPaid || 0) + parseFloat(formData.amount),
          remaining: data.remainingBalance,
        });
        setFormData({ amount: "", phoneNumber: "", reference: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Payment failed. Please try again." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          {/* Loan Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Active Loan Summary</h2>
                <p className="text-sm text-gray-500">Loan ID: {loanData?.loan_id || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Total Loan</p>
                <p className="text-3xl font-bold text-gray-900">
                  Ksh {loanData?.totalAmount?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-3xl font-bold text-blue-600">
                  Ksh {loanData?.remaining?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Next Payment Due</p>
                  <p className="text-sm text-gray-600">{loanData?.due_date || "No active loan"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Message */}
          {message.text && (
            <div
              className={`rounded-lg p-4 border flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-green-50 border-green-200"
                  : message.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : message.type === "error" ? (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              ) : (
                <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <p
                className={`text-sm flex-1 ${
                  message.type === "success"
                    ? "text-green-800"
                    : message.type === "error"
                    ? "text-red-800"
                    : "text-yellow-800"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  M-Pesa Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="2547XXXXXXXX"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Smartphone className="h-5 w-5" />
                    Send M-Pesa Prompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPayment;
