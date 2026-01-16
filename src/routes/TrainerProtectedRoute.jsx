import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const TrainerProtectedRoute = ({ children }) => {
  const { user, loading, refreshUser } = useAuth();

  console.log('TrainerProtectedRoute - User data:', user);
  console.log('TrainerProtectedRoute - User status:', user?.status);
  console.log('TrainerProtectedRoute - User role:', user?.role);

  if (loading) return <p>Loading...</p>;

  if (!user || user.role !== "trainer") {
    console.log('TrainerProtectedRoute - Redirecting to login (user not found or not trainer)');
    return <Navigate to="/login" replace />;
  }

  if (!["approved", "active"].includes(user.status)) {
    console.log('TrainerProtectedRoute - Redirecting to pending (status not approved):', user.status);
    
    // Try to refresh user data before redirecting
    if (refreshUser && typeof refreshUser === 'function') {
      refreshUser().catch(error => {
        console.error('Error refreshing user data in protected route:', error);
      });
    }
    
    return <Navigate to="/trainer/pending" replace />;
  }

  console.log('TrainerProtectedRoute - Allowing access to trainer dashboard');
  return children;
};

export default TrainerProtectedRoute;
