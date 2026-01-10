import { useEffect, useState } from "react";
import {
  getAllAppointments
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| ADMIN APPOINTMENTS MANAGEMENT
|--------------------------------------------------------------------------
| - View all appointments (READ ONLY)
*/
const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD ALL APPOINTMENTS
  |--------------------------------------------------------------------------
  */
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAllAppointments();
      setAppointments(res.data);
    } catch (error) {
      console.error("Failed to load appointments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <>
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Appointments
        </h1>
        <p className="text-gray-500">
          Manage all user-trainer appointments (view only)
        </p>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading appointments...
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Trainer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-400"
                  >
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr
                    key={a._id}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* USER */}
                    <td className="p-3">
                      {a.userId?.name || "N/A"}
                    </td>

                    {/* TRAINER */}
                    <td className="p-3">
                      {a.trainerId?.userId?.name || "N/A"}
                    </td>

                    {/* DATE */}
                    <td className="p-3">
                      {a.date
                        ? new Date(a.date).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* TIME */}
                    <td className="p-3">
                      {a.time || "N/A"}
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold
                          ${
                            a.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : a.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : a.status === "completed"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                      >
                        {a.status || "pending"}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-3 text-center text-gray-400 text-xs">
                      View only
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

export default AdminAppointments;
