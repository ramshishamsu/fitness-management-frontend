import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

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
          <SideLink to="/user/subscription" label="My Subscription" />
          <SideLink to="/user/trainers" label="Trainers" />
          <SideLink to="/user/workouts" label="My Workouts" />
          <SideLink to="/user/appointments" label="Appointments" />
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

const SideLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded-lg transition font-medium
       ${
         isActive
           ? "bg-[#00E676] text-black"
           : "text-gray-300 hover:bg-[#111827]"
       }`
    }
  >
    {label}
  </NavLink>
);
