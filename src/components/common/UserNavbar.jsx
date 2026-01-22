import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/ThemeContext";

// Deployment trigger: UserNavbar with theme support
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
    <header
      className={`
        h-16 flex items-center justify-between px-6 border-b
        ${isDark
          ? "bg-gray-900 border-gray-700 text-neutral-200"
          : "bg-white border-gray-200 text-gray-900"}
      `}
    >
      {/* LEFT */}
      <div className="flex items-center">
        <button
          className={`md:hidden text-xl mr-4 ${
            isDark ? "text-neutral-200" : "text-gray-700"
          }`}
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <h1 className="font-semibold tracking-wide">
          User Dashboard
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className={`
            p-2 rounded-lg transition
            ${isDark
              ? "bg-gray-800 text-neutral-300 hover:bg-gray-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
          `}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`
              flex items-center gap-2 p-2 rounded-lg transition
              ${isDark
                ? "bg-neutral-800 hover:bg-neutral-700"
                : "bg-gray-100 hover:bg-gray-200"}
            `}
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
            <span
              className={`text-sm font-medium hidden lg:block ${
                isDark ? "text-neutral-200" : "text-gray-800"
              }`}
            >
              {user?.name || "User"}
            </span>
          </button>

          {/* DROPDOWN */}
          {profileOpen && (
            <div
              className={`
                absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-2
                ${isDark
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"}
              `}
            >
              <Link
                to="/user/profile"
                onClick={() => setProfileOpen(false)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm transition
                  ${isDark
                    ? "text-neutral-200 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                <User size={16} />
                My Profile
              </Link>

              <Link
                to="/user/settings"
                onClick={() => setProfileOpen(false)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm transition
                  ${isDark
                    ? "text-neutral-200 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                Settings
              </Link>

              <hr className={isDark ? "border-gray-700 my-2" : "border-gray-200 my-2"} />

              <button
                onClick={() => {
                  handleLogout();
                  setProfileOpen(false);
                }}
                className={`
                  flex items-center gap-2 w-full px-4 py-2 text-sm transition
                  ${isDark
                    ? "text-red-400 hover:bg-gray-800"
                    : "text-red-600 hover:bg-gray-100"}
                `}
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
