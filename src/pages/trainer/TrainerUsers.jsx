
import { useEffect, useState } from "react";
import { getTrainerUsers, getTrainerClients } from "../../api/trainerApi";
import { Link } from "react-router-dom";
import { User, Dumbbell, Apple, Eye, Plus } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext.jsx";

const TrainerUsers = () => {
  const { isDark } = useTheme();
  const [allUsers, setAllUsers] = useState([]);
  const [myClients, setMyClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all users
        const allUsersRes = await getTrainerUsers({ all: "true" });
        setAllUsers(allUsersRes.data);

        // Fetch assigned clients (users with workouts)
        const clientsRes = await getTrainerClients();
        setMyClients(clientsRes.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const UserCard = ({ user, showClientBadge = false }) => (
    <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} p-6 rounded-xl hover:${isDark ? 'border-neutral-700' : 'border-gray-300'} transition-all duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center`}>
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
            <p className={`${isDark ? 'text-neutral-400' : 'text-gray-600'} text-sm`}>{user.email}</p>
          </div>
        </div>
        {showClientBadge && (
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
            Client
          </span>
        )}
      </div>

      {user.fitnessGoal && (
        <p className="text-sm mb-4">
          Goal: <span className="text-emerald-400">{user.fitnessGoal}</span>
        </p>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Link
            to={`/trainer/users/${user._id}`}
            className={`flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${
              isDark 
                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="View Profile"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <Link
            to={`/trainer/assign-workout/${user._id}`}
            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Assign Workout"
          >
            <Dumbbell className="w-4 h-4" />
            <span className="hidden sm:inline">Workout</span>
          </Link>

          <Link
            to={`/trainer/nutrition?userId=${user._id}`}
            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            title="Add Nutrition Plan"
          >
            <Apple className="w-4 h-4" />
            <span className="hidden sm:inline">Nutrition</span>
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span className="ml-3 text-neutral-400">Loading users...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>User Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all' 
                ? 'bg-emerald-600 text-white' 
                : isDark
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Users ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'clients' 
                ? 'bg-emerald-600 text-white' 
                : isDark
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            My Clients ({myClients.length})
          </button>
        </div>
      </div>

      {/* All Users Section */}
      {activeTab === 'all' && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <User className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-gray-500'}`} />
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>All Users</h2>
            <span className={`${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>({allUsers.length} total)</span>
          </div>
          
          {allUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className={`${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>No users found in system.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allUsers.map((user) => (
                <UserCard 
                  key={user._id} 
                  user={user}
                  showClientBadge={myClients.some(client => client._id === user._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Clients Section */}
      {activeTab === 'clients' && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Clients</h2>
            <span className={`${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>({myClients.length} assigned)</span>
          </div>
          
          {myClients.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-neutral-600" />
              </div>
              <p className={`${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>No clients assigned yet.</p>
              <p className={`${isDark ? 'text-neutral-500' : 'text-gray-600'} text-sm mb-6`}>Assign workouts to users to make them your clients.</p>
              <Link
                to="/trainer/users"
                onClick={() => setActiveTab('all')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Browse All Users
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myClients.map((client) => (
                <UserCard 
                  key={client._id} 
                  user={client}
                  showClientBadge={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainerUsers;
