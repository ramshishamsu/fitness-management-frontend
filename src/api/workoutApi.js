import API from "./axios";

/*
|--------------------------------------------------------------------------
| WORKOUT APIs
|--------------------------------------------------------------------------
*/

// 🏋️ Get logged-in user's workouts
export const getMyWorkouts = () => {
  return API.get("/workouts/my");
};

// ✅ Mark workout as completed
export const completeWorkout = (id) => {
  return API.put(`/workouts/${id}/complete`);
};

// ✅ ASSIGN WORKOUT (TRAINER)
export const assignWorkout = (data) => {
  return API.post("/workouts/assign", data);
};
export const getUserWorkouts = (userId) => {
  return API.get(`/workouts/user/${userId}`);
};