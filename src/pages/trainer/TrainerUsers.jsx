
import { useEffect, useState } from "react";
import { getTrainerUsers } from "../../api/trainerApi";
import { Link } from "react-router-dom";

const TrainerUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getTrainerUsers().then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Clients</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-neutral-900 p-5 rounded-xl border border-neutral-800"
          >
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-neutral-400 text-sm">{user.email}</p>
            <p className="text-sm mt-1">
              Goal: <span className="text-primary">{user.goal}</span>
            </p>

            <div className="flex gap-2 mt-4">
              <Link
                to={`/trainer/users/${user._id}`}
                className="px-3 py-1 text-sm bg-neutral-800 rounded"
              >
                View Profile
              </Link>

              <Link
                to={`/trainer/assign-workout/${user._id}`}
                className="px-3 py-1 text-sm bg-primary rounded"
              >
                Assign Workout
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerUsers;
