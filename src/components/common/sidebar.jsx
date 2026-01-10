import { Link } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Sidebar Component
|--------------------------------------------------------------------------
| - Responsive (mobile + desktop)
| - Role-based links
*/
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50
          w-64 bg-slate-800 text-white min-h-screen
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        {/* Header (mobile close button) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h3 className="text-xl font-semibold">Menu</h3>

          {/* Close button (mobile) */}
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-5 space-y-3">

          <Link to="/" className={linkStyle} onClick={() => setSidebarOpen(false)}>
            Dashboard
          </Link>

          {/* User */}
          {user?.role === "user" && (
            <Link
              to="/my-workouts"
              className={linkStyle}
              onClick={() => setSidebarOpen(false)}
            >
              My Workouts
            </Link>
          )}

          {/* Trainer */}
          {user?.role === "trainer" && (
            <>
              <Link
                to="/assign-workout"
                className={linkStyle}
                onClick={() => setSidebarOpen(false)}
              >
                Assign Workout
              </Link>

              <Link
                to="/earnings"
                className={linkStyle}
                onClick={() => setSidebarOpen(false)}
              >
                Earnings
              </Link>
            </>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={linkStyle}
              onClick={() => setSidebarOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}

        </nav>
      </aside>
    </>
  );
};

const linkStyle =
  "block px-3 py-2 rounded hover:bg-slate-700 transition";

export default Sidebar;
