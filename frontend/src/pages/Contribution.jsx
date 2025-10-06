import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


const MakeContribution = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const contributionAmount = parseFloat(amount) || 0;
  const transactionFee = contributionAmount * 0.01;
  const total = contributionAmount + transactionFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contribution submission
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center relative">
          <Link to="/dashboard" className="absolute left-4">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Make Contribution</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-foreground">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 h-14 text-lg bg-card border-border"
                step="0.01"
                min="0"
              />
            </div>
          </div>

      {/* Payment Method */}
            <div className="space-y-2">
            <label className="text-foreground">Payment Method</label>
            <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-14 w-full bg-card border border-border rounded-md px-3"
            >
                <option value="" disabled>
                Select payment method
                </option>
                <option value="bank">Bank Transfer</option>
                <option value="mobile">Mobile Money</option>
                <option value="card">Credit/Debit Card</option>
                <option value="cash">Cash</option>
            </select>
            </div>


          {/* Summary */}
          <div className="p-6 bg-card border-border space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Contribution Amount</span>
                <span>${contributionAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Transaction Fee</span>
                <span>${transactionFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-foreground font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!amount || !paymentMethod}
          >
            Confirm Contribution
          </button>
        </form>
      </div>

      
    </div>
  );
};

export default MakeContribution;
