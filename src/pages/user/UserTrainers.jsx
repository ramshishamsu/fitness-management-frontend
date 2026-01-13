import { useEffect, useState } from "react";
import { getAllTrainers } from "../../api/userApi";
import axiosInstance from "../../api/axios";

const UserTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const res = await getAllTrainers();
      console.log('Trainers response:', res.data);
      setTrainers(res.data.trainers || res.data || []);
    } catch (error) {
      console.error('Error loading trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookTrainer = async (trainerId) => {
    try {
      await axiosInstance.post("/appointments", { trainerId });
      alert("Appointment request sent successfully!");
    } catch (error) {
      console.error('Error booking trainer:', error);
      alert("Failed to book appointment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Available Trainers</h1>
        
        {trainers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No trainers available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map(trainer => (
              <div key={trainer._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-2">
                    {trainer.userId?.name || 'Trainer'}
                  </h2>
                  <p className="text-gray-400 mb-4">
                    {trainer.specialization || 'Fitness Trainer'}
                  </p>
                </div>
                
                <button
                  onClick={() => bookTrainer(trainer._id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTrainers;
