import { useState, useEffect } from "react";
import { Mail, Clock, Loader2 } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const LoanRemindersPage = () => {
const [loans, setLoans] = useState([]);
const [loading, setLoading] = useState(true);
const [sending, setSending] = useState(null); // track loan being emailed

useEffect(() => {
const fetchDueLoans = async () => {
try {
const user = JSON.parse(localStorage.getItem("user"));
const token = user?.token;


    if (!token) {
      console.error("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    const response = await fetch("http://localhost:4000/api/loans/loanRepayment", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    setLoans(data.loans || []);
  } catch (error) {
    console.error("Error fetching due loans:", error);
    setLoans([]);
  } finally {
    setLoading(false);
  }
};

fetchDueLoans();


}, []);

const sendReminder = async (loanId) => {
try {
setSending(loanId);
const user = JSON.parse(localStorage.getItem("user"));
const token = user?.token;


  const response = await fetch(`http://localhost:4000/api/loans/send-reminder/${loanId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  alert("Reminder email sent successfully.");
} catch (error) {
  console.error("Error sending reminder:", error);
  alert("Failed to send reminder.");
} finally {
  setSending(null);
}


};

return ( <div className="flex"> <AdminSidebar /> <div className="flex-1 p-6 bg-gray-50 min-h-screen"> <div className="flex justify-between items-center mb-6"> <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-700"> <Clock className="text-blue-600" size={24} /> Loan Reminders </h1> </div>


    {loading ? (
      <div className="flex justify-center items-center h-40 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        Loading loans...
      </div>
    ) : loans.length === 0 ? (
      <div className="text-center text-gray-500 mt-10">
        <p>No loans are due within 3 days.</p>
      </div>
    ) : (
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="py-2 px-3">Loan ID</th>
              <th className="py-2 px-3">Username</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Due Date</th>
              <th className="py-2 px-3">Days Left</th>
              <th className="py-2 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const dueDate = new Date(loan.due_date);
              const today = new Date();
              const diffDays = Math.ceil(
                (dueDate - today) / (1000 * 60 * 60 * 24)
              );

              return (
                <tr key={loan.loan_id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{loan.loan_id}</td>
                  <td className="py-2 px-3">{loan.user?.userName || "N/A"}</td>
                  <td className="py-2 px-3 text-gray-600">{loan.user?.email || "N/A"}</td>
                  <td className="py-2 px-3 font-medium text-gray-700">
                    KSh {parseFloat(loan.amount).toLocaleString()}
                  </td>
                  <td className="py-2 px-3">
                    {dueDate.toLocaleDateString("en-KE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-2 px-3 text-red-500 font-semibold">
                    {diffDays} days left
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => sendReminder(loan.loan_id)}
                      disabled={sending === loan.loan_id}
                      className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm text-white transition ${
                        sending === loan.loan_id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {sending === loan.loan_id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Mail size={16} />
                      )}
                      {sending === loan.loan_id ? "Sending..." : "Send Reminder"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>


);
};

export default LoanRemindersPage;
