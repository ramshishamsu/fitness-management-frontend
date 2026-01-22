import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import UserSidebar from "./UserSidebar";
import Footer from "./Footer";
import { useState } from "react";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <UserSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <UserNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 px-10 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
