import { useEffect, useState } from "react";
import { getAllPayments } from "../../api/adminApi";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await getAllPayments();
      // API returns { payments, pagination }
      setPayments(res.data?.payments || []);
    } catch (error) {
      console.error("Failed to load payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Payments
        </h1>
        <p className="text-gray-500">
          All user payments & revenue
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading payments...
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    {/* USER */}
                    <td className="p-3">
                      {p.userId?.name || "N/A"}
                    </td>

                    {/* AMOUNT */}
                    <td className="p-3 font-semibold">
                      ₹{p.amount}
                    </td>

                    {/* METHOD */}
                    <td className="p-3 capitalize">
                      {p.paymentMethod || "N/A"}
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold
                          ${
                            p.paymentStatus === "success"
                              ? "bg-green-100 text-green-600"
                              : p.paymentStatus === "failed"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                      >
                        {p.paymentStatus || "pending"}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="p-3">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminPayments;
