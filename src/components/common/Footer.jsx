import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();
  
  return (
    <footer className={`
      fixed bottom-0 left-0 right-0 z-50
      w-full
      ${isDark 
        ? "bg-slate-900/95 backdrop-blur-md border-t border-slate-700" 
        : "bg-white/95 backdrop-blur-md border-t border-gray-200"
      }
      transition-colors duration-300
    `}>
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
          
          {/* BRAND */}
          <div className="flex items-center space-x-2">
            <span className={`font-bold text-sm ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              FITNESS PRO
            </span>
            <span className={`text-xs ${isDark ? "text-slate-600" : "text-gray-400"}`}>
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* MINIMAL LINKS */}
          <div className="flex items-center space-x-3 text-xs">
            <Link
              to="/user/dashboard"
              className={`transition-colors ${isDark ? "text-slate-500 hover:text-teal-400" : "text-gray-500 hover:text-teal-600"}`}
            >
              Dashboard
            </Link>
            <Link
              to="/user/my-workouts"
              className={`transition-colors ${isDark ? "text-slate-500 hover:text-teal-400" : "text-gray-500 hover:text-teal-600"}`}
            >
              Workouts
            </Link>
            <Link
              to="/user/goals"
              className={`transition-colors ${isDark ? "text-slate-500 hover:text-teal-400" : "text-gray-500 hover:text-teal-600"}`}
            >
              Goals
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
