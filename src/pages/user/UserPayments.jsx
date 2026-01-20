import { useEffect, useState } from "react";
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

      console.log("Payments response:", res.data);

      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-6 text-white">
        My Payments
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {payments.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No payments found.
        </div>
      )}

      {payments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-neutral-900 text-neutral-300">
              <tr>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="text-gray-800">
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    ₹{p.amount}
                  </td>

                  <td className="p-4 capitalize">
                    {p.paymentStatus || "success"}
                  </td>

                  <td className="p-4 uppercase">
                    {p.paymentMethod || "N/A"}
                  </td>

                  <td className="p-4">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPayments;
