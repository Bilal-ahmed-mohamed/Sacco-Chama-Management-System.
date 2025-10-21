import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Smartphone, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar"; // ✅ adjust path as needed

const MakeContribution = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contributionDate, setContributionDate] = useState("");

  const contributionAmount = parseFloat(amount) || 0;
  const transactionFee = 0;
  const total = contributionAmount + transactionFee;

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user_id) {
      alert("User not found. Please log in again.");
      return;
    }

    if (!amount || contributionAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const simulateRes = await fetch("http://localhost:4000/api/mpesa/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          amount: contributionAmount,
          user_id,
        }),
      });

      const simulateData = await simulateRes.json();

      if (!simulateRes.ok) {
        console.error("❌ Simulation error:", simulateData);
        alert(simulateData.message || "M-Pesa simulation failed.");
        return;
      }

      const saveRes = await fetch("http://localhost:4000/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          amount: contributionAmount,
          method: "mpesa",
          date: contributionDate || new Date(),
          transaction_id: simulateData?.data?.OriginatorCoversationID || "SIMULATED_TXN",
        }),
      });

      const saveData = await saveRes.json();

      if (saveRes.ok) {
        alert("Contribution recorded successfully!");
        navigate("/dashboard");
      } else {
        alert(saveData.message || "Failed to save contribution.");
      }
    } catch (error) {
      console.error("🚨 Error submitting contribution:", error);
      alert("Server error. Please try again later.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

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

          <h1 className="text-2xl font-bold mb-6 text-gray-800">Make a Contribution</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">Contribution Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-4 text-2xl font-semibold border rounded-xl focus:ring-2 focus:ring-blue-200"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Date */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">Contribution Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                <input
                  type="date"
                  value={contributionDate}
                  onChange={(e) => setContributionDate(e.target.value)}
                  max={today}
                  className="w-full pl-12 pr-4 py-4 text-lg font-medium border rounded-xl focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">M-Pesa Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                <input
                  type="tel"
                  placeholder="254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg font-medium border rounded-xl focus:ring-2 focus:ring-blue-200"
                  pattern="[0-9]{12}"
                  required
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="flex justify-between text-sm mb-2">
                <span>Contribution Amount</span>
                <span>KSh {contributionAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-blue-600">KSh {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-base font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              disabled={!amount || !phoneNumber || !contributionDate || contributionAmount <= 0}
            >
              Confirm Contribution
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeContribution;
