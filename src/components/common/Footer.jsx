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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* BRAND */}
          <div className="space-y-3">
            <h3 className={`text-xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              FITNESS PRO
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Your fitness journey starts here. Train smarter, live stronger.
            </p>
            <div className="flex space-x-3 pt-2">
              <Link
                to="/user/dashboard"
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-transform hover:scale-110 ${
                  isDark 
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white" 
                    : "bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                }`}
              >
                F
              </Link>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/user/dashboard"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/user/my-workouts"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  My Workouts
                </Link>
              </li>
              <li>
                <Link
                  to="/user/nutrition-tracker"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  Nutrition
                </Link>
              </li>
              <li>
                <Link
                  to="/user/goals"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  Goals
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/user/profile"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/user/progress"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/user/payments"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  Payment History
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className={`border-t ${isDark ? "border-slate-700" : "border-gray-200"} pt-4 mt-6`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className={`text-xs ${isDark ? "text-slate-500" : "text-gray-500"}`}>
              © {new Date().getFullYear()} Fitness Pro. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <Link
                to="/privacy"
                className={`transition-colors ${isDark ? "text-slate-500 hover:text-teal-400" : "text-gray-500 hover:text-teal-600"}`}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className={`transition-colors ${isDark ? "text-slate-500 hover:text-teal-400" : "text-gray-500 hover:text-teal-600"}`}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
