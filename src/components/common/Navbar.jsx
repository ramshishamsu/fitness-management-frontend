import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="
      sticky top-0 z-50
      backdrop-blur-md
      bg-neutral-950/85 dark:bg-neutral-950
      border-b border-neutral-800
    ">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-wide text-neutral-100"
        >
          FITNESS<span className="text-emerald-500">PRO</span>
        </Link>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
          <NavLink to="/">Home</NavLink>

          {user ? (
            <>
              <NavLink to="/user">Dashboard</NavLink>
              <NavLink to="/user/profile">Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link
                to="/register"
                className="
                  bg-emerald-500 text-black
                  px-4 py-2 rounded-md
                  font-medium
                  hover:bg-emerald-400
                  transition
                "
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="
              p-2 rounded-md
              bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-700 dark:hover:bg-neutral-600
              text-neutral-300 dark:text-neutral-200
              transition
            "
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* MOBILE MENU */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-neutral-300"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="
          md:hidden
          bg-neutral-950
          border-t border-neutral-800
          px-6 py-4 space-y-4
          text-neutral-300
        ">
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
                className="text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileLink to="/login" onClick={() => setOpen(false)}>
                Login
              </MobileLink>
              <MobileLink to="/register" onClick={() => setOpen(false)}>
                Register
              </MobileLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="hover:text-white transition"
  >
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block hover:text-white transition"
  >
    {children}
  </Link>
);

export default Navbar;
