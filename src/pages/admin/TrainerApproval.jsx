import { useEffect, useState } from "react";
import {
  getAllTrainers,
  approveTrainer,
  rejectTrainer,
  getAllUsers
} from "../../api/adminApi";
import axiosInstance from "../../api/axios";

/*
|--------------------------------------------------------------------------
| TRAINER APPROVAL PAGE
|--------------------------------------------------------------------------
| - Lists trainer applications and allows admin to approve/reject
*/
const TrainerApproval = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [processingDoc, setProcessingDoc] = useState(null);
  const [error, setError] = useState(null);

  const loadTrainers = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getAllTrainers();
      console.log("getAllTrainers res:", res);

      // API might return { trainers, pagination } or an array directly
      let data = res.data?.trainers ?? (Array.isArray(res.data) ? res.data : []);

      // If admin trainer endpoint returned empty, fallback to users with role=trainer
      if ((!data || data.length === 0)) {
        try {
          const usersRes = await getAllUsers();
          const users = usersRes.data?.users ?? (Array.isArray(usersRes.data) ? usersRes.data : []);
          // Filter users with role 'trainer' and map to trainer-like objects
          const mapped = users
            .filter((u) => u.role === "trainer")
            .map((u) => ({
              _id: u._id,
              userId: { name: u.name, email: u.email },
              status: u.status || "pending",
              fallbackUser: true
            }));

          data = mapped;
        } catch (uErr) {
          console.warn("Fallback to users failed", uErr);
        }
      }

      setTrainers(data || []);
      if (!data || data.length === 0) {
        // If response was empty, give a hint (could be auth issue)
        if (res.status === 401 || res.status === 403) {
          setError('Unauthorized: please ensure you are logged in as an admin');
        }
      }
    } catch (err) {
      console.error("Failed to load trainers", err);
      setError(err.response?.data?.message || err.message || 'Failed to load trainers');
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, item) => {
    if (!window.confirm("Approve this trainer?")) return;

    try {
      setProcessingId(id);
      if (item?.fallbackUser) {
        // Fallback: call trainer route that accepts user id
        await axiosInstance.put(`/trainers/${id}/approve`);
      } else {
        await approveTrainer(id);
      }
      await loadTrainers();
    } catch (error) {
      alert("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id, item) => {
    if (!window.confirm("Reject this trainer?")) return;

    try {
      setProcessingId(id);
      if (item?.fallbackUser) {
        await axiosInstance.put(`/trainers/${id}/reject`);
      } else {
        await rejectTrainer(id);
      }
      await loadTrainers();
    } catch (error) {
      alert("Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerifyDoc = async (trainerId, docId, action) => {
    if (!window.confirm(`${action === 'approve' ? 'Verify' : 'Reject'} this document?`)) return;
    try {
      setProcessingDoc(`${trainerId}_${docId}`);
      await axiosInstance.put(`/admin/trainers/${trainerId}/docs/${docId}/verify`, { action });
      await loadTrainers();
    } catch (err) {
      console.error('Verify doc failed', err);
      alert('Verify action failed');
    } finally {
      setProcessingDoc(null);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trainers</h1>
        <p className="text-gray-500">Approve or reject trainer applications</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading trainers...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4">
          <div className="flex items-start justify-between">
            <div>{error}</div>
            <div>
              <button
                onClick={loadTrainers}
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Documents</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {trainers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">No trainers registered</td>
                </tr>
              ) : (
                trainers.map((t) => (
                    <tr key={t._id} className="border-t">
                      <td className="p-3">{t.userId?.name || "N/A"}</td>
                      <td className="p-3">{t.userId?.email || "N/A"}</td>

                      <td className="p-3">
                        {t.documents && t.documents.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {t.documents.map((doc) => (
                              <div key={doc._id || doc.url} className="flex items-center justify-between">
                                <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm text-emerald-500">{doc.type}</a>
                                <div className="flex gap-2">
                                  {!doc.verified && (
                                    <>
                                      <button
                                        onClick={() => handleVerifyDoc(t._id, doc._id, 'approve')}
                                        disabled={processingDoc === `${t._id}_${doc._id}`}
                                        className="px-2 py-1 text-xs rounded bg-green-600 text-white disabled:opacity-50"
                                      >
                                        {processingDoc === `${t._id}_${doc._id}` ? '...' : 'Verify'}
                                      </button>
                                      <button
                                        onClick={() => handleVerifyDoc(t._id, doc._id, 'reject')}
                                        disabled={processingDoc === `${t._id}_${doc._id}`}
                                        className="px-2 py-1 text-xs rounded bg-red-600 text-white disabled:opacity-50"
                                      >
                                        {processingDoc === `${t._id}_${doc._id}` ? '...' : 'Reject'}
                                      </button>
                                    </>
                                  )}
                                  {doc.verified && (
                                    <span className="text-emerald-400 text-xs">Verified</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-400">No documents</span>
                        )}
                      </td>

                      <td className="p-3 capitalize">
                        <span className={`px-2 py-1 rounded text-xs ${t.status === 'approved' ? 'bg-green-100 text-green-800' : t.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-600'}`}>{t.status}</span>
                      </td>

                      <td className="p-3 text-center">
                        {t.status === 'pending' ? (
                          <div className="flex justify-center gap-2">
                            <button
                            onClick={() => handleApprove(t._id, t)}
                            disabled={processingId === t._id}
                            className="px-3 py-1 text-xs rounded bg-green-600 text-white disabled:opacity-50"
                          >
                            {processingId === t._id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(t._id, t)}
                              disabled={processingId === t._id}
                              className="px-3 py-1 text-xs rounded bg-red-600 text-white disabled:opacity-50"
                            >
                              {processingId === t._id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No actions</div>
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

export default TrainerApproval;
