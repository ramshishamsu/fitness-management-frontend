import { Routes, Route, Navigate } from "react-router-dom";

// PUBLIC
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// LAYOUTS
import UserLayout from "./components/common/UserLayout";
import AdminLayout from "./components/common/AdminLayout";

// USER
import UserProfile from "./pages/user/UserProfile";
import UserDashboard from "./pages/user/UserDashboard";
import UserTrainers from "./pages/user/UserTrainers";
import UserPayments from "./pages/user/UserPayments";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyWorkouts from "./pages/user/MyWorkouts";
import UserNutritionTracker from "./pages/user/UserNutritionTracker";
import UserCheckout from "./pages/user/UserCheckout";
import UserPlans from "./pages/user/UserPlans";
import UserPaymentSuccess from "./pages/user/UserPaymentSuccess";
import UserPaymentCancel from "./pages/user/UserPaymentCancel";
import WorkoutDetails from "./pages/user/WorkoutDetails";
// TRAINER
import TrainerPending from "./pages/trainerStatus/TrainerPending";
import TrainerProtectedRoute from "./routes/TrainerProtectedRoute";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import TrainerUsers from "./pages/trainer/TrainerUsers";
import TrainerViewUserProfile from "./pages/trainer/TrainerViewUserProfile";
import AssignWorkout from "./pages/trainer/AssignWorkout";
import TrainerLayout from "./components/common/TrainerLayout";
import TrainerNutritionManager from "./pages/trainer/TrainerNutritionManager";



// ADMIN
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTrainerDetails from "./pages/admin/AdminTrainerDetails";
import TrainerApproval from "./pages/admin/TrainerApproval";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminAssignPlan from "./pages/admin/AdminAssignPlan";
const App = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ================= USER ================= */}
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={["user"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="nutrition-tracker" element={<UserNutritionTracker />} />
        <Route path="nutrition-log/:planId" element={<UserNutritionTracker />} />
        <Route path="my-workouts" element={<MyWorkouts />} />
        <Route path="trainers" element={<UserTrainers />} />
        <Route path="plans" element={<UserPlans />} />
        <Route path="checkout/:planId" element={<UserCheckout />} />
        <Route path="payments" element={<UserPayments />} />
        <Route path="success" element={<UserPaymentSuccess />} />
        <Route path="cancel" element={<UserPaymentCancel />} />
        <Route path="/user/workouts/:id" element={<WorkoutDetails />} />

      </Route>

      {/* ================= TRAINER ================= */}
      <Route path="/trainer/pending" element={<TrainerPending />} />

      <Route
        path="/trainer"
        element={
          <TrainerProtectedRoute>
            <TrainerLayout />
          </TrainerProtectedRoute>
        }
      >
        <Route index element={<TrainerDashboard />} />
        <Route path="dashboard" element={<TrainerDashboard />} />
        <Route path="profile" element={<TrainerProfile />} />
        <Route path="users" element={<TrainerUsers />} />
        <Route path="users/:id" element={<TrainerViewUserProfile />} />
        <Route path="assign-workout/:id" element={<AssignWorkout />} />
        <Route path="nutrition" element={<TrainerNutritionManager />} />
        <Route path="nutrition-plans" element={<TrainerNutritionManager />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="assign-plan" element={<AdminAssignPlan />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="trainer-details/:id" element={<AdminTrainerDetails />} />
        <Route path="trainers" element={<TrainerApproval />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="withdrawals" element={<AdminWithdrawals />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
