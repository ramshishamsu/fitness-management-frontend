import axios from "axios";

/*
|--------------------------------------------------------------------------
| CREATE ADMIN AXIOS INSTANCE
|--------------------------------------------------------------------------
| - baseURL points to admin routes
| - automatically used for all admin API calls
*/
const API = axios.create({
  baseURL: "/api/admin"
});
// BLOCK / UNBLOCK USER
export const toggleUserStatus = (id) =>
  API.put(`/users/${id}/block`);

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| - Runs BEFORE every request
| - Attaches JWT token to Authorization header
| - Keeps admin routes secure
*/
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

export const getAdminStats = () => API.get("/stats");

/*
|--------------------------------------------------------------------------
| USER MANAGEMENT
|--------------------------------------------------------------------------
*/
export const getAllUsers = () => API.get("/users");

/*
|--------------------------------------------------------------------------
| TRAINER MANAGEMENT
|--------------------------------------------------------------------------
*/
export const getAllTrainers = () => API.get("/trainers");
export const approveTrainer = (id) =>
  API.put(`/trainers/${id}/approve`);
export const rejectTrainer = (id) =>
  API.put(`/trainers/${id}/reject`);

/*
|--------------------------------------------------------------------------
| APPOINTMENTS
|--------------------------------------------------------------------------
*/
export const getAllAppointments = () =>
  API.get("/appointments");




/*
|--------------------------------------------------------------------------
| PAYMENTS & WITHDRAWALS
|--------------------------------------------------------------------------
*/
export const getAllPayments = () =>
  API.get("/payments");

export const getAllWithdrawals = () =>
  API.get("/withdrawals");

export const approveWithdrawal = (id) =>
  API.put(`/withdrawals/${id}/approve`);

export const rejectWithdrawal = (id) =>
  API.put(`/withdrawals/${id}/reject`);
 
