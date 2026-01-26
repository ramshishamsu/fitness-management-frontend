import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// Vercel deployment trigger: ThemeProvider fixed
/* ================= PUBLIC ================= */
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PublicLayout from "./components/common/PublicLayout";
/* ================= LAYOUTS ================= */
import UserLayout from "./components/common/UserLayout";
import AdminLayout from "./components/common/AdminLayout";
import TrainerLayout from "./components/common/TrainerLayout";

/* ================= ROUTE GUARDS ================= */
import ProtectedRoute from "./routes/ProtectedRoute";
import TrainerProtectedRoute from "./routes/TrainerProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

/* ================= USER ================= */
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import UserTrainers from "./pages/user/UserTrainers";
import UserPayments from "./pages/user/UserPayments";
import MyWorkouts from "./pages/user/MyWorkouts";
import WorkoutDetails from "./pages/user/WorkoutDetails";
import UserNutritionTracker from "./pages/user/UserNutritionTracker";
import UserCheckout from "./pages/user/UserCheckout";
import UserGoals from "./pages/user/UserGoals";
import UserPlans from "./pages/user/UserPlans";
import UserPaymentSuccess from "./pages/user/UserPaymentSuccess";
import UserPaymentCancel from "./pages/user/UserPaymentCancel";
import UserMessages from "./pages/user/UserMessages";

/* ================= TRAINER ================= */
import TrainerPending from "./pages/trainerStatus/TrainerPending";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import TrainerUsers from "./pages/trainer/TrainerUsers";
import TrainerViewUserProfile from "./pages/trainer/TrainerViewUserProfile";
import AssignWorkout from "./pages/trainer/AssignWorkout";
import TrainerNutritionManager from "./pages/trainer/TrainerNutritionManager";
import TrainerEarnings from "./pages/trainer/TrainerEarnings";
import TrainerMessages from "./pages/trainer/TrainerMessages";

/* ================= ADMIN ================= */
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
    <ThemeProvider>
      <Routes>

        {/* ========== PUBLIC ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        {/* ========== USER ========== */}
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
          <Route path="trainers" element={<UserTrainers />} />
          <Route path="plans" element={<UserPlans />} />
          <Route path="checkout/:planId" element={<UserCheckout />} />

          {/* WORKOUTS */}
          <Route path="my-workouts" element={<MyWorkouts />} />
          <Route path="workouts/:id" element={<WorkoutDetails />} />

          {/* NUTRITION */}
          <Route path="nutrition-tracker" element={<UserNutritionTracker />} />
          <Route path="nutrition-log/:planId" element={<UserNutritionTracker />} />

          {/* GOALS */}
          <Route path="goals" element={<UserGoals />} />

          {/* PAYMENTS */}
          <Route path="payments" element={<UserPayments />} />
          <Route path="payment-success" element={<UserPaymentSuccess />} />
          <Route path="payment-cancel" element={<UserPaymentCancel />} />

          {/* MESSAGES */}
          <Route path="messages" element={<UserMessages />} />
          <Route path="messages/:trainerId" element={<UserMessages />} />
        </Route>
        {/* ========== TRAINER ========== */}
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
          <Route path="earnings" element={<TrainerEarnings />} />
          <Route path="messages" element={<TrainerMessages />} />
          
        </Route>

        {/* ========== ADMIN ========== */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="trainer-details/:id" element={<AdminTrainerDetails />} />
          <Route path="trainers" element={<TrainerApproval />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="assign-plan" element={<AdminAssignPlan />} />
        </Route>

        {/* ========== FALLBACK ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </ThemeProvider>
  );
};

export default App;
