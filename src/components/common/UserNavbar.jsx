import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/useTheme";

const UserNavbar = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#1F2937] bg-[#050505]">
      {/* LEFT SIDE */}
      <div className="flex items-center">
        <button
          className="md:hidden text-xl mr-4 text-white"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <h1 className="font-semibold tracking-wide text-white">
          User Dashboard
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition"
          >
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            )}
            <span className="text-sm font-medium text-neutral-200 hidden lg:block">
              {user?.name || "User"}
            </span>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 py-2">
              <Link
                to="/user/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700"
              >
                <User size={16} />
                My Profile
              </Link>
              <Link
                to="/user/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700"
              >
                Settings
              </Link>
              <hr className="my-2 border-neutral-700" />
              <button
                onClick={() => {
                  handleLogout();
                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-neutral-700"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
