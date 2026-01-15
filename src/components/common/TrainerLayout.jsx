import TrainerSidebar from "./TrainerSidebar";
import TrainerNavbar from "./TrainerNavbar";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";

const TrainerLayout = () => {
  const { isDark } = useTheme();

  return (
    <div className={`flex ${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      <TrainerSidebar />

      <div className="flex-1">
        <TrainerNavbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;
