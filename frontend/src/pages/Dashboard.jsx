import { Link } from "react-router-dom";
import { ArrowLeft, ArrowDown, ArrowUpRight, LayoutGrid, PiggyBank, Wallet, User } from "lucide-react";


const Dashboard = () => {
  const transactions = [
    { type: "Deposit", category: "Contribution", amount: 500, icon: ArrowDown },
    { type: "Payment", category: "Loan Repayment", amount: -250, icon: ArrowUpRight },
    { type: "Deposit", category: "Contribution", amount: 300, icon: ArrowDown },
    { type: "Payment", category: "Loan Repayment", amount: -200, icon: ArrowUpRight },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Member Profile */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-4 border-primary/30" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Sophia Carter</h2>
              <p className="text-muted-foreground">Member ID: 12345</p>
            </div>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white/80 backdrop-blur-sm border-primary/20">
            <p className="text-muted-foreground mb-2">Total Contributions</p>
            <p className="text-4xl font-bold text-foreground">$5,250</p>
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm border-primary/20">
            <p className="text-muted-foreground mb-2">Outstanding Loan</p>
            <p className="text-4xl font-bold text-foreground">$2,000</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Recent Transactions</h3>
          <div className="bg-white/80 backdrop-blur-sm border-primary/20 divide-y divide-primary/10">
            {transactions.map((transaction, index) => {
              const Icon = transaction.icon;
              return (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <p className={`text-xl font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/contribution">
              <button className="w-full h-16 text-lg font-semibold bg-primary hover:bg-primary/90">
                Make Contribution
              </button>
            </Link>
            <Link to="/loans">
              <button variant="outline" className="w-full h-16 text-lg font-semibold border-2 border-primary/30 text-primary hover:bg-primary/10">
                Apply for Loan
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary/20 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <LayoutGrid className="h-6 w-6" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link to="/contribution" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <PiggyBank className="h-6 w-6" />
            <span className="text-xs font-medium">Contributions</span>
          </Link>
          <Link to="/loans" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <Wallet className="h-6 w-6" />
            <span className="text-xs font-medium">Loans</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
