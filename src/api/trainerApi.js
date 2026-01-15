/*
|--------------------------------------------------------------------------
| TRAINER API CALLS
|--------------------------------------------------------------------------
| All trainer-related backend requests
*/

import API from "./axios";

// 🔹 Get trainer total earnings (released payments only)
export const getTrainerEarnings = async () => {
  return API.get("/trainers/earnings");
};

// 🔹 Trainer requests withdrawal
export const requestWithdrawal = async (amount) => {
  return API.post("/trainers/withdraw", { amount });
};

// 🔹 (Optional) Get trainer own withdrawal history
export const getMyWithdrawals = async () => {
  return API.get("/trainers/withdrawals");
};
export const getTrainerUsers = (params) => {
  return API.get("/trainers/users", { params });
};

export const getTrainerClients = () => {
  return API.get("/trainers/clients");
};