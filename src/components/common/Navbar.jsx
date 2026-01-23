import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

  const navItems = [
    { name: "Home", href: "/" },
  ];

  const rightNavItems = [
    { name: "Features", href: "/#features" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        sticky top-0 z-50
        backdrop-blur-md
        ${isDark 
          ? "bg-neutral-900/95 border-neutral-800" 
          : "bg-white/95 border-gray-200"
        }
        border-b
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className={`
            text-xl font-bold transition-colors
            ${isDark ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-500"}
          `}
        >
          FITNESS PRO
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                text-sm font-medium transition-colors hover:text-emerald-400
                ${isDark ? "text-neutral-300" : "text-gray-700"}
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center space-x-4">
          {/* RIGHT SIDE NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-6">
            {rightNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  text-sm font-medium transition-colors hover:text-emerald-400
                  ${isDark ? "text-neutral-300" : "text-gray-700"}
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className={`
              p-2 rounded-lg transition-all
              ${isDark
                ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* AUTH BUTTONS */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/user/dashboard"
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${isDark
                      ? "text-neutral-300 hover:text-white border border-neutral-600 hover:border-neutral-500"
                      : "text-gray-700 hover:text-black border border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${isDark
                      ? "text-neutral-300 hover:text-white border border-neutral-600 hover:border-neutral-500"
                      : "text-gray-700 hover:text-black border border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-emerald-500 text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-emerald-400 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className={`
              md:hidden p-2 rounded-lg transition-colors
              ${isDark
                ? "text-neutral-300 hover:bg-neutral-800"
                : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            md:hidden border-t
            ${isDark ? "border-neutral-800 bg-neutral-900/95" : "border-gray-200 bg-white/95"}
          `}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Main Navigation */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium transition-colors
                  ${isDark
                    ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Right Side Navigation */}
            {rightNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium transition-colors
                  ${isDark
                    ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 pb-2 border-t border-neutral-700">
              {user ? (
                <>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setOpen(false)}
                    className={`
                      block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors mb-2
                      ${isDark
                        ? "text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-black border border-gray-300"
                      }
                    `}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                    className={`
                      block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors mb-2
                      ${isDark
                        ? "text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-black border border-gray-300"
                      }
                    `}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setOpen(false);
                    }}
                    className="block w-full bg-emerald-500 text-black px-3 py-2 rounded-md text-base font-semibold hover:bg-emerald-400 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
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
