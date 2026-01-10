import { useEffect, useState } from "react";
import {
  getAllTrainers,
  approveTrainer,
  rejectTrainer,
} from "../../api/adminApi";

const TrainerApproval = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res = await getAllTrainers();
      console.log("TRAINERS API RESPONSE 👉", res.data);
      setTrainers(res.data);
    } catch (err) {
      console.error("Failed to load trainers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await approveTrainer(id);
    loadTrainers();
  };

  const handleReject = async (id) => {
    await rejectTrainer(id);
    loadTrainers();
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-4 font-semibold border-b">Trainer Requests</div>

      {/* 🔹 LOADING STATE */}
      {loading ? (
        <div className="p-6 text-center text-gray-500">Loading trainers...</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {trainers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No trainers found
                </td>
              </tr>
            ) : (
              trainers.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="p-3">{t.userId?.name}</td>
                  <td className="p-3">{t.userId?.email}</td>

                  <td className="p-3 capitalize">{t.status}</td>
                  <td className="p-3">
                    {t.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(t._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(t._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No action</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainerApproval;
