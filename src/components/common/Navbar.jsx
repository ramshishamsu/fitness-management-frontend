/*
|--------------------------------------------------------------------------
| NAVBAR – DARK INDUSTRIAL (cult.fit style)
|--------------------------------------------------------------------------
| - Sticky
| - Mobile responsive
| - Auth aware
*/

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/useTheme";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          FITNESS PRO
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <NavLink to="/">Home</NavLink>

          {user ? (
            <>
              <NavLink to="/user">Dashboard</NavLink>
              <NavLink to="/profile">Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link
                to="/register"
                className="bg-emerald-500 text-black px-5 py-2 rounded-md font-semibold hover:bg-emerald-400 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* RIGHT SIDE CONTROLS */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                )}
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 hidden lg:block">
                  {user.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2">
                  <Link
                    to="/user/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <Link
                    to="/user/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    Settings
                  </Link>
                  <hr className="my-2 border-neutral-200 dark:border-neutral-700" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-neutral-600 dark:text-neutral-300"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-6 py-6 space-y-4">
          <MobileLink to="/" onClick={() => setOpen(false)}>
            Home
          </MobileLink>

          {user ? (
            <>
              <MobileLink to="/user" onClick={() => setOpen(false)}>
                Dashboard
              </MobileLink>

              <MobileLink to="/user/profile" onClick={() => setOpen(false)}>
                Profile
              </MobileLink>

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full text-left text-red-600 dark:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileLink to="/login" onClick={() => setOpen(false)}>
                Login
              </MobileLink>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block bg-emerald-500 text-black px-5 py-3 rounded-md font-semibold text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

/* ================= HELPERS ================= */

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
  >
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
  >
    {children}
  </Link>
);

export default Navbar;
