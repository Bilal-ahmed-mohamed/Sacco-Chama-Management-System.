import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Smartphone, Calendar } from "lucide-react";

const MakeContribution = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contributionDate, setContributionDate] = useState("");

  const contributionAmount = parseFloat(amount) || 0;
  const transactionFee = 0; // optional
  const total = contributionAmount + transactionFee;

  // Get logged-in user from localStorage
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
      // 🔹 Step 1: Trigger M-Pesa Simulation
      const simulateRes = await fetch("http://localhost:4000/api/mpesa/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          amount: contributionAmount,
          user_id, // required
        }),
      });

      const simulateData = await simulateRes.json();

      if (!simulateRes.ok) {
        console.error("❌ Simulation error:", simulateData);
        alert(simulateData.message || "M-Pesa simulation failed.");
        return;
      }

      console.log("✅ M-Pesa Simulation Successful:", simulateData);

      // 🔹 Step 2: Save Contribution Record
      const saveRes = await fetch("http://localhost:4000/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id, // required
          amount: contributionAmount, // required
          method: "mpesa", // required
          date: contributionDate || new Date(),
          transaction_id: simulateData?.data?.OriginatorCoversationID || "SIMULATED_TXN",
        }),
      });

      const saveData = await saveRes.json();

      if (saveRes.ok) {
        console.log("💾 Contribution Saved:", saveData);
        alert("Contribution recorded successfully!");
        navigate("/dashboard");
      } else {
        console.error("❌ Save error:", saveData);
        alert(saveData.message || "Failed to save contribution.");
      }
    } catch (error) {
      console.error("🚨 Error submitting contribution:", error);
      alert("Server error. Please try again later.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-6 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Make Contribution</h1>
            <p className="text-sm text-white/80 mt-1">Support your SACCO group</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          
          {/* Amount Input */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Contribution Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-4 text-2xl font-semibold bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              step="0.01"
              min="0"
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter the amount you want to contribute
            </p>
          </div>

          {/* Date Input */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Contribution Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="date"
                value={contributionDate}
                onChange={(e) => setContributionDate(e.target.value)}
                max={today}
                className="w-full pl-12 pr-4 py-4 text-lg font-medium bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg font-medium bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                pattern="[0-9]{12}"
                required
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contribution Amount</span>
                <span className="font-medium text-foreground">KSh {contributionAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-base font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">KSh {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 text-base font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            disabled={!amount || !phoneNumber || !contributionDate || contributionAmount <= 0}
          >
            Confirm Contribution
          </button>

        </form>
      </div>
    </div>
  );
};

export default MakeContribution;
