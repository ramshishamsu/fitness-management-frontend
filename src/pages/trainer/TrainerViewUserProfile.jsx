import { useParams } from "react-router-dom";

const TrainerViewUserProfile = () => {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        User Profile
      </h2>

      <p className="text-neutral-400">
        User ID: {id}
      </p>
    </div>
  );
};

export default TrainerViewUserProfile;
