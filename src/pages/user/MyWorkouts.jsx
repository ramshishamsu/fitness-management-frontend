import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

const UserWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    axiosInstance.get("/workouts/my").then(res => {
      setWorkouts(res.data);
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Workouts</h2>

      {workouts.map(w => (
        <div key={w._id} className="bg-gray-800 p-4 rounded mb-3">
          <h3 className="font-semibold">{w.title}</h3>
          <p>{w.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UserWorkouts;
