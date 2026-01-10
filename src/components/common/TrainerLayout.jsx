import TrainerSidebar from "./TrainerSidebar";
import TrainerNavbar from "./TrainerNavbar";
import { Outlet } from "react-router-dom";

const TrainerLayout = () => {
  return (
    <div className="flex bg-neutral-950 min-h-screen text-white">
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
