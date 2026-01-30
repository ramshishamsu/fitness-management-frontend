import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { TrendingUp, MessageSquare, X, Plus, Calendar } from "lucide-react";

/*
|--------------------------------------------------------------------------
| UserSidebar
|--------------------------------------------------------------------------
| - ONLY for USER dashboard
| - Cult.fit / Nike style
| - Logout at bottom
*/

const UserSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showProgressHistory, setShowProgressHistory] = useState(false);
  const [showFeedbackHistory, setShowFeedbackHistory] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [progressForm, setProgressForm] = useState({
    weight: '',
    measurements: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    comment: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axiosInstance.get("/messages/conversations");
        const conversations = res.data || [];
        // Count conversations with unread messages (simplified - you may need to implement unread logic)
        setUnreadCount(conversations.length > 0 ? conversations.length : 0);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };
    
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout(); // clear context + localStorage
    navigate("/login", { replace: true });
  };

  // Progress functions
  const handleProgressSubmit = (e) => {
    e.preventDefault();
    const existingProgress = JSON.parse(localStorage.getItem('user_progress') || '[]');
    const newProgress = {
      id: Date.now(),
      ...progressForm,
      timestamp: new Date().toISOString()
    };
    existingProgress.push(newProgress);
    localStorage.setItem('user_progress', JSON.stringify(existingProgress));
    setProgressForm({
      weight: '',
      measurements: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowProgressModal(false);
  };

  // Feedback functions
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    
    // Validate rating is selected
    if (feedbackForm.rating === 0) {
      alert('Please select a rating before submitting feedback');
      return;
    }
    
    const existingFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
    const newFeedback = {
      id: Date.now(),
      ...feedbackForm,
      timestamp: new Date().toISOString()
    };
    existingFeedback.push(newFeedback);
    localStorage.setItem('user_feedback', JSON.stringify(existingFeedback));
    setFeedbackForm({
      rating: 0,
      comment: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowFeedbackModal(false);
    alert('✅ Feedback submitted successfully!');
  };

  // Load history data
  const loadProgressHistory = () => {
    const data = JSON.parse(localStorage.getItem('user_progress') || '[]');
    setProgressData(data.reverse());
    setShowProgressHistory(true);
  };

  const loadFeedbackHistory = () => {
    const data = JSON.parse(localStorage.getItem('user_feedback') || '[]');
    setFeedbackData(data.reverse());
    setShowFeedbackHistory(true);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          w-64 min-h-screen
          bg-[#0B0F14] text-white
          border-r border-[#1F2937]
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F2937]">
          <h2 className="text-xl font-bold text-[#00E676]">
            FITNESS PRO
          </h2>

          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="px-6 py-6 space-y-3 flex-1">
          <SideLink to="/user/dashboard" label="Dashboard" />
          <SideLink to="/user/profile" label="My Profile" />
          <SideLink to="/user/plans" label="Plans" />
          <SideLink to="/user/trainers" label="Trainers" />
          <SideLink to="/user/my-workouts" label="My Workouts" />
          <SideLink to="/user/nutrition-tracker" label="Nutrition" />
          <SideLink to="/user/goals" label="Goals" />
          <SideLink to="/user/messages" label="Messages" badge={unreadCount} />
          <SideLink to="/user/payments" label="Payments" />
          
          {/* Progress & Feedback Section */}
          <div className="pt-4 border-t border-[#1F2937]">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Personal Tracking</p>
            
            <button
              onClick={() => setShowProgressModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-green-400 hover:bg-green-500/10 transition"
            >
              <TrendingUp size={18} />
              <span>Add Progress</span>
            </button>
            
            <button
              onClick={loadProgressHistory}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-teal-400 hover:bg-teal-500/10 transition"
            >
              <Calendar size={18} />
              <span>Progress History</span>
            </button>
            
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-purple-400 hover:bg-purple-500/10 transition"
            >
              <Plus size={18} />
              <span>Add Feedback</span>
            </button>
            
            <button
              onClick={loadFeedbackHistory}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-orange-400 hover:bg-orange-500/10 transition"
            >
              <MessageSquare size={18} />
              <span>Feedback History</span>
            </button>
          </div>
        </nav>

        {/* LOGOUT (BOTTOM) */}
        <div className="px-6 py-4 border-t border-[#1F2937]">
          <button
            onClick={handleLogout}
            className="
              w-full text-left px-4 py-2 rounded-lg font-medium
              text-red-400 hover:text-red-500
              hover:bg-red-500/10 transition
            "
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Progress</h3>
              <button
                onClick={() => setShowProgressModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProgressSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  value={progressForm.date}
                  onChange={(e) => setProgressForm({...progressForm, date: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Weight (kg)</label>
                <input
                  type="number"
                  value={progressForm.weight}
                  onChange={(e) => setProgressForm({...progressForm, weight: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter weight"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Measurements</label>
                <input
                  type="text"
                  value={progressForm.measurements}
                  onChange={(e) => setProgressForm({...progressForm, measurements: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Chest, Waist, etc."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  value={progressForm.notes}
                  onChange={(e) => setProgressForm({...progressForm, notes: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows="3"
                  placeholder="Progress notes..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Save Progress
                </button>
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Rating {feedbackForm.rating > 0 && `(${feedbackForm.rating}/5)`}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                      className={`text-2xl transition-colors ${star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                {feedbackForm.rating === 0 && (
                  <p className="text-xs text-gray-500 mt-1">Please select a rating</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Comment</label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={(e) => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows="4"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  value={feedbackForm.date}
                  onChange={(e) => setFeedbackForm({...feedbackForm, date: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  Submit Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress History Modal */}
      {showProgressHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Progress History</h3>
              <button
                onClick={() => setShowProgressHistory(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {progressData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No progress records found</p>
            ) : (
              <div className="space-y-4">
                {progressData.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 dark:border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{item.date}</span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {item.weight && <p><strong>Weight:</strong> {item.weight} kg</p>}
                      {item.measurements && <p><strong>Measurements:</strong> {item.measurements}</p>}
                      {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setShowProgressHistory(false)}
              className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Feedback History Modal */}
      {showFeedbackHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Feedback History</h3>
              <button
                onClick={() => setShowFeedbackHistory(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {feedbackData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No feedback records found</p>
            ) : (
              <div className="space-y-4">
                {feedbackData.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 dark:border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{item.date}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{item.comment}</p>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setShowFeedbackHistory(false)}
              className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSidebar;

/* ===============================
   NAV LINK STYLE
================================ */

const SideLink = ({ to, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded-lg transition font-medium relative
       ${
         isActive
           ? "bg-[#00E676] text-black"
           : "text-gray-300 hover:bg-[#111827]"
       }`
    }
  >
    {label}
    {badge > 0 && (
      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </NavLink>
);
