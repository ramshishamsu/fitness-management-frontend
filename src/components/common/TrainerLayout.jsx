import TrainerSidebar from "./TrainerSidebar";
import TrainerNavbar from "./TrainerNavbar";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useState, useEffect } from "react";

const TrainerLayout = () => {
  const { isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <div className={`flex ${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      <TrainerSidebar />
      
      <div className="flex-1 lg:ml-0">
        <TrainerNavbar />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;
