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
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-neutral-950/80 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-emerald-400">
          FITNESS PRO
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <NavLink to="/">Home</NavLink>

          {user ? (
            <>
              <NavLink to="/user">Dashboard</NavLink>
              <NavLink to="/profile">Profile</NavLink>

              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-red-400 transition"
              >
                Logout
              </button>
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

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-neutral-950 border-t border-neutral-800 px-6 py-6 space-y-4">
          <MobileLink to="/" onClick={() => setOpen(false)}>
            Home
          </MobileLink>

          {user ? (
            <>
              <MobileLink to="/user" onClick={() => setOpen(false)}>
                Dashboard
              </MobileLink>

              <MobileLink to="/profile" onClick={() => setOpen(false)}>
                Profile
              </MobileLink>

              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-400"
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
    className="text-neutral-300 hover:text-white transition"
  >
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-neutral-300 hover:text-white transition"
  >
    {children}
  </Link>
);

export default Navbar;
