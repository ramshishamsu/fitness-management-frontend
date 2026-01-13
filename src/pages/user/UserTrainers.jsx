import { useEffect, useState } from "react";
import { getAllTrainers } from "../../api/userApi";
import axiosInstance from "../../api/axios";
import UserLayout from "../../components/common/UserLayout";

const UserTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <UserLayout>
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
                <div key={trainer._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                  <div className="mb-4">
                    {trainer.profileImage && (
                      <img 
                        src={trainer.profileImage} 
                        alt={trainer.userId?.name || 'Trainer'}
                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                    <h2 className="text-xl font-bold mb-2 text-center">
                      {trainer.userId?.name || 'Trainer'}
                    </h2>
                    <p className="text-gray-400 mb-2 text-center">
                      {trainer.specialization || 'Fitness Trainer'}
                    </p>
                    <div className="text-center text-sm text-gray-500">
                      <p>🎯 {trainer.experience} years experience</p>
                      <p>⭐ {trainer.rating || '4.5'} rating</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => bookTrainer(trainer._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserTrainers;
