import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  IndianRupee,
  Apple,
  LogOut,
  MessageCircle
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";

const TrainerSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

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
        <SidebarLink to="/trainer/messages" icon={<MessageCircle/>} text="Messages" badge={unreadCount}/>
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

const SidebarLink = ({ to, icon, text, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md relative ${
        isActive ? "bg-neutral-800 text-emerald-400" : "text-neutral-300 hover:bg-neutral-800"
      }`
    }
  >
    {icon}
    {text}
    {badge > 0 && (
      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </NavLink>
);

export default TrainerSidebar;
