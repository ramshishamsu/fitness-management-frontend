import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, LogOut, Menu, X, Settings, BarChart3, CreditCard, Calendar } from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen flex bg-gradient-to-br from-rose-50 to-pink-50">

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72
        bg-gradient-to-b from-rose-100 via-pink-50 to-rose-100
        text-rose-900 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-rose-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-rose-900">Admin</h1>
              <p className="text-xs text-rose-600">Control Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-rose-200 transition-colors"
          >
            <X size={20} className="text-rose-700" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} text="Dashboard" />
          <SidebarLink to="/admin/users" icon={<Users size={18} />} text="Users" />
          <SidebarLink to="/admin/trainers" icon={<UserCheck size={18} />} text="Trainers" />
          <SidebarLink to="/admin/appointments" icon={<Calendar size={18} />} text="Appointments" />
          <SidebarLink to="/admin/payments" icon={<CreditCard size={18} />} text="Payments" />
          <SidebarLink to="/admin/withdrawals" icon={<BarChart3 size={18} />} text="Withdrawals" />
          <SidebarLink to="/admin/plans" icon={<Settings size={18} />} text="Plans"/>
        </nav>

        <div className="p-4 border-t border-rose-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg text-white"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP BAR */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-rose-200 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Menu size={20} className="text-rose-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">{pageTitle}</h1>
              <p className="text-sm text-rose-500">Admin Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-rose-700">Online</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
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
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? "bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-700 border border-rose-400/30 shadow-lg shadow-rose-500/20" 
          : "text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:translate-x-1"
      }`
    }
  >
    <span className={`transition-colors ${
      ({ isActive }) => isActive ? "text-rose-700" : "text-rose-600 group-hover:text-rose-700"
    }`}>
      {icon}
    </span>
    <span className="font-medium">{text}</span>
  </NavLink>
);
