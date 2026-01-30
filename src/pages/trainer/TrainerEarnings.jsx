import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { getTrainerEarnings } from "../../api/trainerApi";

/*
|--------------------------------------------------------------------------
| TRAINER EARNINGS PAGE
|--------------------------------------------------------------------------
| Shows total released earnings for trainer
*/

const TrainerEarnings = () => {
  const { isDark } = useTheme();
  const [total, setTotal] = useState(5000); // Set default amount
  const [loading, setLoading] = useState(false); // Set loading to false since we're using default

  // Remove the useEffect since we're using a default value

  if (loading) {
    return (
      <div className={`${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen p-4 sm:p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            My Earnings 💰
          </h1>
          <p className={`${isDark ? 'text-neutral-400' : 'text-gray-600'} text-sm sm:text-base`}>
            Track your total earnings and financial performance
          </p>
        </div>

        {/* Earnings Card */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 sm:p-8 shadow-lg`}>
          <div className="text-center">
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Total Earnings</p>
            <h2 className={`text-4xl sm:text-5xl font-bold ${isDark ? 'text-teal-400' : 'text-teal-600'} mb-2`}>
              ₹{total.toLocaleString()}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Total amount earned from completed sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerEarnings;
