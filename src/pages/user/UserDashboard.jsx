import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";


/*
|--------------------------------------------------------------------------
| USER DASHBOARD
|--------------------------------------------------------------------------
| - Fetch user on mount
| - Show welcome message with user name
| - Keep existing UI
*/

const UserDashboard = () => {
    const { user } = useAuth(); // ✅ SINGLE SOURCE OF TRUTH



  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        {/* ✅ Welcome user name */}
        <h1 className="text-2xl font-semibold mb-2 text-gray-300">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h1>

        <h1 className="text-4xl font-extrabold tracking-tight">
          Train Smarter.
        </h1>
        <h2 className="text-4xl font-extrabold text-[#00E676]">
          Live Stronger.
        </h2>

        <p className="text-gray-400 mt-3 max-w-xl">
          Track workouts, manage nutrition, connect with trainers,
          and build lifelong fitness habits.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-6">

        <DashboardCard
          title="No Active Plan"
          desc="Choose a fitness plan and start your journey."
          action="Buy Plan"
          link="/user/plans"
        />

        <DashboardCard
          title="No Trainer Assigned"
          desc="Select a professional trainer to guide you."
          action="Choose Trainer"
          link="/user/trainers"
        />

        <DashboardCard
          title="No Workouts Yet"
          desc="Your trainer will assign workouts here."
          action="View Workouts"
          link="/user/workouts"
        />

      </div>
    </div>
  );
};

export default UserDashboard;

/* ===============================
   CARD
================================ */

const DashboardCard = ({ title, desc, action, link }) => (
  <div className="bg-[#0B0F14] border border-[#1F2937] p-8 rounded-2xl">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-400 mt-2">{desc}</p>

    <Link
      to={link}
      className="inline-block mt-6 px-6 py-2 rounded
      bg-[#00E676] text-black font-semibold
      hover:bg-[#00C853] transition"
    >
      {action}
    </Link>
  </div>
  
);
