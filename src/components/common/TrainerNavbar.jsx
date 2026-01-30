import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

const TrainerNavbar = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("trainerAvatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  return (
    <header className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4`}>
      <h1 className={`font-semibold text-base sm:text-lg ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>Trainer Dashboard</h1>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all duration-200 border ${
            isDark 
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-neutral-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
          }`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* Profile */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate("/trainer/profile")}
        >
          <img
            src={avatar || "/avatar.png"}
            alt="trainer"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-neutral-700"
          />
          <span className={`text-xs sm:text-sm ${isDark ? 'text-neutral-300' : 'text-gray-600'} hidden sm:block`}>My Profile</span>
        </div>
      </div>
    </header>
  );
};

export default TrainerNavbar;
