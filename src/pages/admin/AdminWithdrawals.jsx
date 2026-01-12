import { useEffect, useState } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| ADMIN WITHDRAWALS
|--------------------------------------------------------------------------
| - Approve / Reject trainer withdrawals
*/
const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await getAllWithdrawals();
      // API returns { withdrawals, pagination }
      setWithdrawals(res.data?.withdrawals || []);
    } catch (error) {
      console.error("Failed to load withdrawals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this withdrawal?")) return;

    try {
      await approveWithdrawal(id);
      loadWithdrawals();
    } catch (error) {
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this withdrawal?")) return;

    try {
      await rejectWithdrawal(id);
      loadWithdrawals();
    } catch (error) {
      alert("Rejection failed");
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Withdrawals
        </h1>
        <p className="text-gray-500">
          Trainer withdrawal requests
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading withdrawals...
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Trainer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center text-gray-400"
                  >
                    No withdrawal requests
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w._id} className="border-t">
                    <td className="p-3">
                      {w.trainer?.userId?.name || "N/A"}
                    </td>
                    <td className="p-3 font-semibold">
                      ₹{w.amount}
                    </td>
                    <td className="p-3 capitalize">
                      <span
                        className={`px-2 py-1 rounded text-xs
                          ${
                            w.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : w.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                      >
                        {w.status}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {w.status === "pending" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleApprove(w._id)
                            }
                            className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleReject(w._id)
                            }
                            className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Action completed
                        </span>
                      )}
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

export default AdminWithdrawals;
