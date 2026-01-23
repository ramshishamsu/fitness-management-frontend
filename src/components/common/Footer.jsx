import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* BRAND */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              FITNESS PRO
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your fitness journey starts here. Train smarter, live stronger.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                to="/user/dashboard"
                className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform"
              >
                F
              </Link>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/user/dashboard"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/user/my-workouts"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  My Workouts
                </Link>
              </li>
              <li>
                <Link
                  to="/user/nutrition-tracker"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Nutrition
                </Link>
              </li>
              <li>
                <Link
                  to="/user/goals"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Goals
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/user/profile"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/user/progress"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/user/payments"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Payment History
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/help"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Fitness Pro. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <Link
                to="/privacy"
                className="hover:text-teal-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-teal-400 transition-colors"
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
