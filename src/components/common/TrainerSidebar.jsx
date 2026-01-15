import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  IndianRupee,
  Apple,
  LogOut
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

const TrainerSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-5">
      <h2 className="text-xl font-bold mb-8">Trainer Panel</h2>

      <nav className="space-y-4">
        <SidebarLink to="/trainer/dashboard" icon={<LayoutDashboard />} text="Dashboard" />
        <SidebarLink to="/trainer/users" icon={<Users />} text="Clients" />
        <SidebarLink to="/trainer/users" icon={<Dumbbell />} text="Assign Workout" />
        <SidebarLink to="/trainer/nutrition" icon={<Apple />} text="Nutrition Plans" />
        <SidebarLink to="/trainer/earnings" icon={<IndianRupee />} text="Earnings" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 mt-8"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
};

const SidebarLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md ${
        isActive ? "bg-neutral-800 text-emerald-400" : "text-neutral-300 hover:bg-neutral-800"
      }`
    }
  >
    {icon}
    {text}
  </NavLink>
);

export default TrainerSidebar;
