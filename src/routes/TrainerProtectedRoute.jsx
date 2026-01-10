import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const TrainerProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user || user.role !== "trainer") {
    return <Navigate to="/login" replace />;
  }

  if (!["approved", "active"].includes(user.status)) {
    return <Navigate to="/trainer/pending" replace />;
  }

  return children;
};

export default TrainerProtectedRoute;
