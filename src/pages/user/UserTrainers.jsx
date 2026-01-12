import { useEffect, useState } from "react";
import { getAllTrainers } from "../../api/userApi";
import axiosInstance from "../../api/axios";

const UserTrainers = () => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    const res = await getAllTrainers();
    setTrainers(res.data);
  };

  const bookTrainer = async (trainerId) => {
    await axiosInstance.post("/appointments", { trainerId });
    alert("Trainer booked successfully");
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {trainers.map(trainer => (
        <div key={trainer._id} className="bg-gray-800 p-6 rounded-lg">
          <h2 className="font-bold">{trainer.userId?.name || 'Unknown'}</h2>
          <p className="text-sm text-gray-400">{trainer.specialization}</p>

          <button
            onClick={() => bookTrainer(trainer._id)}
            className="mt-4 bg-green-500 w-full py-2 rounded"
          >
            Book Trainer
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserTrainers;
