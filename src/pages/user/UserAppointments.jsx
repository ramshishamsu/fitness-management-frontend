import { useEffect, useState } from "react";
import UserLayout from "../../components/common/UserLayout";
import { getMyAppointments } from "../../api/appointmentApi";
import Loader from "../../components/common/Loader";

/*
|--------------------------------------------------------------------------
| USER APPOINTMENTS
|--------------------------------------------------------------------------
| - Shows logged-in user's appointments
| - Fetches data from backend using API
*/

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getMyAppointments();
        setAppointments(res.data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6 text-white">
          My Appointments
        </h1>

        {/* Loader */}
        {loading && <Loader />}

        {/* Empty state */}
        {!loading && appointments.length === 0 && (
          <p className="text-gray-500">
            No appointments booked yet.
          </p>
        )}

        {/* Appointment list */}
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white p-4 rounded border shadow-sm"
            >
              <p><b>Trainer:</b> {a.trainer?.name}</p>
              <p><b>Date:</b> {a.date}</p>
              <p><b>Time:</b> {a.time}</p>
              <p>
              <b>Status:</b>{" "}
              <StatusBadge status={a.status} />
            </p>
          </div>
        ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserAppointments;

/*
|--------------------------------------------------------------------------
| STATUS BADGE COMPONENT
|--------------------------------------------------------------------------
| - Shows appointment status with color
*/
const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  return (
    <span
      className={`px-2 py-1 rounded text-sm ${colors[status]}`}
    >
      {status}
    </span>
  );
};
