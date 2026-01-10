import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TrainerNavbar = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("trainerAvatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  return (
    <header className="flex justify-between items-center border-b border-neutral-800 px-6 py-4">
      <h1 className="font-semibold text-lg">Trainer Dashboard</h1>

      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/trainer/profile")}
      >
        <img
          src={avatar || "/avatar.png"}
          alt="trainer"
          className="w-9 h-9 rounded-full object-cover border border-neutral-700"
        />
        <span className="text-sm text-neutral-300">My Profile</span>
      </div>
    </header>
  );
};

export default TrainerNavbar;
