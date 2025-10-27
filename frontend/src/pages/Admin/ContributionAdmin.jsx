import { useState, useEffect } from "react";
import { Search, Wallet, Loader2 } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const ContributionAdmin = () => {
const [contributions, setContributions] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
        const fetchContributions = async () => {
        try {

        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        const response = await fetch("http://localhost:4000/api/contributions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
   

    if (!response.ok) throw new Error("Failed to fetch contributions");
    const data = await response.json();

    setContributions(data.contributions || []);
  } catch (error) {
    console.error("Error fetching contributions:", error);
  } finally {
    setLoading(false);
  }
};

fetchContributions();


}, []);

const filteredContributions = contributions.filter(
(c) =>
c.user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
c.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
);

return ( <div className="flex"> <AdminSidebar /> <div className="flex-1 p-6 bg-gray-50 min-h-screen"> <div className="flex justify-between items-center mb-6"> <h1 className="text-2xl font-semibold flex items-center gap-2"> <Wallet size={22} /> All Contributions </h1> <div className="relative"> <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
<input
type="text"
placeholder="Search by username or transaction ID..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
/> </div> </div>


    {loading ? (
      <div className="flex justify-center items-center h-40 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        Loading contributions...
      </div>
    ) : filteredContributions.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
        <span className="text-3xl mb-2">💰</span>
        <p>No contribution records available</p>
      </div>
    ) : (
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="py-2 px-3">Contribution ID</th>
              <th className="py-2 px-3">Member ID</th>
              <th className="py-2 px-3">Username</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Method</th>
              <th className="py-2 px-3">Transaction ID</th>
              <th className="py-2 px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredContributions.map((c) => (
              <tr key={c.contributions_id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{c.contributions_id}</td>
                <td className="py-2 px-3">{c.user_id}</td>
                <td className="py-2 px-3">{c.user?.userName || "N/A"}</td>
                <td className="py-2 px-3">
                  KSh {parseFloat(c.amount).toLocaleString()}
                </td>
                <td className="py-2 px-3 capitalize">{c.method}</td>
                <td className="py-2 px-3 text-gray-600">{c.transaction_id}</td>
                <td className="py-2 px-3">
                  {new Date(c.date).toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>


);
};

export default ContributionAdmin;
