import { useEffect, useState } from "react";
import UserLayout from "../../components/common/UserLayout";
import { getMyPayments } from "../../api/paymentApi";
import Loader from "../../components/common/Loader";

const UserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await getMyPayments();
      console.log("Payments:", res.data); // 🔍 DEBUG
      setPayments(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Payments</h1>

        {loading && <Loader />}

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && payments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400">
              No payments found.
            </div>
          </div>
        )}

        {payments.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border border-neutral-800 rounded-lg">
                <thead className="bg-neutral-900 text-neutral-400">
                  <tr>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Method</th>
                    <th className="p-4 text-left">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t border-neutral-800"
                    >
                      <td className="p-4">₹{p.amount}</td>
                      <td className="p-4 capitalize">{p.paymentStatus}</td>
                      <td className="p-4 uppercase">{p.paymentMethod}</td>
                      <td className="p-4">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserPayments;
