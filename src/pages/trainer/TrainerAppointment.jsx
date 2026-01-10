import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import {
  getTrainerAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment
} from "../../api/appointmentApi";

/*
|--------------------------------------------------------------------------
| TRAINER APPOINTMENTS
|--------------------------------------------------------------------------
*/

const TrainerAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    const res = await getTrainerAppointments();
    setAppointments(res.data);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleAction = async (id, action) => {
    if (action === "approve") await approveAppointment(id);
    if (action === "reject") await rejectAppointment(id);
    if (action === "complete") await completeAppointment(id);

    loadAppointments(); // refresh list
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">
        Manage Appointments
      </h1>

      <div className="space-y-4">
        {appointments.map((a) => (
          <div
            key={a._id}
            className="bg-white p-4 rounded border shadow-sm"
          >
            <p><b>User:</b> {a.user?.email}</p>
            <p><b>Date:</b> {a.date}</p>
            <p><b>Time:</b> {a.time}</p>
            <p><b>Status:</b> {a.status}</p>

            <div className="mt-3 space-x-2">
              {a.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      handleAction(a._id, "approve")
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleAction(a._id, "reject")
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </>
              )}

              {a.status === "approved" && (
                <button
                  onClick={() =>
                    handleAction(a._id, "complete")
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default TrainerAppointments;
