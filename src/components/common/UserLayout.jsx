import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import UserSidebar from "./UserSidebar";
import Footer from "./Footer";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      className={`
        min-h-screen flex
        ${isDark
          ? "bg-neutral-950 text-neutral-200"
          : "bg-gray-50 text-gray-900"}
      `}
    >
      <UserSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <UserNavbar setSidebarOpen={setSidebarOpen} />

        <main
          className={`
            flex-1 px-10 py-8 transition-colors
            ${isDark ? "bg-black" : "bg-gray-50"}
          `}
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
