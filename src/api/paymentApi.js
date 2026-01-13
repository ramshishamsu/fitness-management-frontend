import API from "./axios";

/*
|--------------------------------------------------------------------------
| PAYMENT APIs
|--------------------------------------------------------------------------
*/

// 💳 Create Razorpay order
export const createCheckoutSession = (data) => {
  return API.post("/payments/checkout", data);
};

// 📜 Logged-in user's payment history
export const getMyPayments = () => {
  return API.get("/payments");
};

// 💰 Trainer earnings (admin / trainer)
export const getTrainerEarnings = () => {
  return API.get("/trainers/earnings");
};
