import { useEffect, useState } from "react";
import { getAllTrainers } from "../../api/userApi";
import axiosInstance from "../../api/axios";
import UserLayout from "../../components/common/UserLayout";

const UserTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 UserTrainers component mounted');
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      console.log('🔍 Loading trainers from API...');
      const res = await getAllTrainers();
      console.log('✅ API Response:', res);
      console.log('✅ Response data:', res.data);
      console.log('✅ Trainers array:', res.data?.trainers);
      console.log('✅ Trainers count:', res.data?.trainers?.length || 0);

      setTrainers(res.data.trainers || res.data || []);
    } catch (error) {
      console.error('❌ Error loading trainers:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const bookTrainer = async (trainerId) => {
    try {
      console.log('🔍 Booking trainer:', trainerId);
      const response = await axiosInstance.post("/appointments", {
        trainerId: trainerId,
        date: new Date().toISOString().split('T')[0],
        time: "10:00 AM",
        notes: "Booking from trainers page"
      });
      console.log('✅ Appointment booked:', response.data);
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error('❌ Error booking trainer:', error);
      console.error('❌ Error details:', error.response?.data);
      alert("Failed to book appointment: " + (error.response?.data?.message || error.message));
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
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-white">Available Trainers</h1>
        
        {trainers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300">No trainers available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trainers.map((trainer, index) => (
              <div key={trainer._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:scale-105">
                <div className="mb-4">
                  <img 
                    src={trainer.profileImage || `https://picsum.photos/seed/${trainer._id}/200/200.jpg`}
                    alt={trainer.userId?.name || 'Trainer'}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gray-600"
                  />
                  <h3 className="text-xl font-bold text-white mb-2 text-center">
                    {trainer.userId?.name || 'Trainer'}
                  </h3>
                  <p className="text-gray-300 mb-4 text-center text-sm">
                    {trainer.specialization || 'Fitness Trainer'}
                  </p>
                  <div className="text-center text-sm text-gray-400 space-y-1">
                    <p>🎯 {trainer.experience} years experience</p>
                    <p>⭐ {trainer.rating || '4.5'} rating</p>
                  </div>
                </div>
                <button
                  onClick={() => bookTrainer(trainer._id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserTrainers;
