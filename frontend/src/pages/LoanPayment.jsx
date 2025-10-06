import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Calendar, AlertCircle, CreditCard } from "lucide-react";

const LoanPayment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loanId: "",
    amount: "",
    paymentMethod: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment data:", formData);
    navigate("/dashboard");
  };

  // Mock loan data
  const activeLoan = {
    id: "LN-2024-001",
    totalAmount: 5000,
    paidAmount: 2000,
    remainingAmount: 3000,
    nextDueDate: "2024-02-15",
    monthlyPayment: 500
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Loan Payment</h1>
            <p className="text-white/90 text-sm">Make a payment on your loan</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Loan Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Active Loan Summary</h2>
              <p className="text-sm text-gray-500">Loan ID: {activeLoan.id}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Total Loan</p>
                <p className="text-3xl font-bold text-gray-900">${activeLoan.totalAmount}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-3xl font-bold text-blue-600">${activeLoan.remainingAmount}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Next Payment Due</p>
                  <p className="text-sm text-gray-600">{activeLoan.nextDueDate}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">${activeLoan.monthlyPayment}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${(activeLoan.paidAmount / activeLoan.totalAmount) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                ${activeLoan.paidAmount} paid of ${activeLoan.totalAmount} ({Math.round((activeLoan.paidAmount / activeLoan.totalAmount) * 100)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Make Payment</h2>
            <p className="text-sm text-gray-600">Enter payment details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-900">
                Payment Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="500"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex gap-3 mt-3">
                <button 
                  type="button" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setFormData({...formData, amount: activeLoan.monthlyPayment.toString()})}
                >
                  Monthly Payment
                </button>
                <button 
                  type="button" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setFormData({...formData, amount: activeLoan.remainingAmount.toString()})}
                >
                  Full Balance
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-900">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                required
              >
                <option value="" disabled>Select payment method</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="mobile-money">Mobile Money</option>
                <option value="debit-card">Debit Card</option>
                <option value="cash">Cash Deposit</option>
              </select>
            </div>

            {formData.paymentMethod === "debit-card" && (
              <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-900">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-900">
                      Expiry Date
                    </label>
                    <input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-900">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="reference" className="block text-sm font-medium text-gray-900">
                Reference (Optional)
              </label>
              <input
                id="reference"
                name="reference"
                type="text"
                placeholder="Payment reference or note"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              Submit Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanPayment;