import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement loan application submission
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center relative">
          <Link to="/dashboard" className="absolute left-4">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Apply for a Loan</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          {/* Loan Type */}
          <div className="space-y-2">
            <label className="text-foreground">Loan Type</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="h-14 w-full bg-card border border-border px-3 rounded"
            >
              <option value="">Select Loan Type</option>
              <option value="personal">Personal Loan</option>
              <option value="emergency">Emergency Loan</option>
              <option value="development">Development Loan</option>
              <option value="school">School Fees Loan</option>
            </select>
          </div>

          {/* Loan Amount */}
          <div className="space-y-2">
            <label className="text-foreground">Loan Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="h-14 w-full bg-card border border-border px-3 rounded"
              step="0.01"
              min="0"
            />
          </div>

          {/* Repayment Period */}
          <div className="space-y-2">
            <label className="text-foreground">Repayment Period (Months)</label>
            <input
              type="number"
              placeholder="e.g., 12"
              value={repaymentPeriod}
              onChange={(e) => setRepaymentPeriod(e.target.value)}
              className="h-14 w-full bg-card border border-border px-3 rounded"
              min="1"
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label className="text-foreground">Purpose of Loan</label>
            <textarea
              placeholder="Briefly describe the purpose of the loan"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="min-h-32 w-full bg-card border border-border px-3 py-2 rounded resize-none"
            />
          </div>

          {/* Supporting Documents */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Supporting Documents</h3>
            
            <div className="p-4 bg-card border border-border flex items-center justify-between hover:bg-accent transition-colors cursor-pointer rounded">
              <span className="text-foreground">Upload ID Copy</span>
              <Upload className="h-6 w-6 text-primary" />
            </div>

            <div className="p-4 bg-card border border-border flex items-center justify-between hover:bg-accent transition-colors cursor-pointer rounded">
              <span className="text-foreground">Upload Payslip</span>
              <Upload className="h-6 w-6 text-primary" />
            </div>

            <div className="p-4 bg-card border border-border flex items-center justify-between hover:bg-accent transition-colors cursor-pointer rounded">
              <span className="text-foreground">Upload Bank Statement</span>
              <Upload className="h-6 w-6 text-primary" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded"
            disabled={!loanType || !loanAmount || !repaymentPeriod || !purpose}
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLoan;
