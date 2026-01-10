import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, LogOut } from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

const pageTitle = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/trainers": "Trainers",
  "/admin/appointments": "Appointments",
  "/admin/payments": "Payments",
  "/admin/withdrawals": "Withdrawals",
   "/admin/plans": "Plans"
}[location.pathname];


  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-800">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} text="Dashboard" />
          <SidebarLink to="/admin/users" icon={<Users size={18} />} text="Users" />
          <SidebarLink to="/admin/trainers" icon={<UserCheck size={18} />} text="Trainers" />

           <SidebarLink to="/admin/appointments" icon={<LayoutDashboard size={18} />} text="Appointments" />
           <SidebarLink to="/admin/payments" icon={<LayoutDashboard size={18} />} text="Payments" />
           <SidebarLink to="/admin/withdrawals" icon={<LayoutDashboard size={18} />} text="Withdrawals" />
          <SidebarLink to="/admin/plans" icon={<LayoutDashboard size={18} />} text="Plans"/>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 flex items-center gap-3 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
          <span className="text-sm text-gray-500">Admin</span>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;

/* ---------- Sidebar Link ---------- */
const SidebarLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-md transition ${
        isActive ? "bg-gray-800 text-emerald-400" : "text-gray-300 hover:bg-gray-800"
      }`
    }
  >
    {icon}
    <span>{text}</span>
  </NavLink>
);
