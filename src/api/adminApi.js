import axiosInstance from "./axios";

// Helper wrapper that prefixes /admin to all calls and reuses axiosInstance (preserves auth header)
const adminApi = {
  get: (path, ...args) => axiosInstance.get(`/admin${path}`, ...args),
  post: (path, ...args) => axiosInstance.post(`/admin${path}`, ...args),
  put: (path, ...args) => axiosInstance.put(`/admin${path}`, ...args),
  delete: (path, ...args) => axiosInstance.delete(`/admin${path}`, ...args),
};

// Convenience exports
export const toggleUserStatus = (id) => adminApi.put(`/users/${id}/block`);
export const getAdminStats = () => adminApi.get("/stats");
export const getAllUsers = () => adminApi.get("/users");
export const getAllTrainers = () => adminApi.get("/trainers");
export const approveTrainer = (id) => adminApi.put(`/trainers/${id}/approve`);
export const rejectTrainer = (id) => adminApi.put(`/trainers/${id}/reject`);
export const getAllAppointments = () => adminApi.get("/appointments");
export const getAllPayments = () => adminApi.get("/payments");
export const getAllWithdrawals = () => adminApi.get("/withdrawals");
export const approveWithdrawal = (id) => adminApi.put(`/withdrawals/${id}/approve`);
export const rejectWithdrawal = (id) => adminApi.put(`/withdrawals/${id}/reject`);

export default adminApi;
 
