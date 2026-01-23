import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* BRAND */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              FITNESS PRO
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Your fitness journey starts here
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/user/dashboard"
              className="text-slate-400 hover:text-teal-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/user/my-workouts"
              className="text-slate-400 hover:text-teal-400 transition-colors"
            >
              Workouts
            </Link>
            <Link
              to="/user/nutrition-tracker"
              className="text-slate-400 hover:text-teal-400 transition-colors"
            >
              Nutrition
            </Link>
            <Link
              to="/user/goals"
              className="text-slate-400 hover:text-teal-400 transition-colors"
            >
              Goals
            </Link>
          </div>

          {/* COPYRIGHT */}
          <div className="text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Fitness Pro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
