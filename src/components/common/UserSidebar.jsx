import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";

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
