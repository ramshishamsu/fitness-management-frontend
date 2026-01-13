import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| USER / AUTH APIs
|--------------------------------------------------------------------------
*/

// 👥 Get all approved trainers
export const getAllTrainers = () => {
  return axiosInstance.get("/admin/public-trainers", {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
};

// 📝 Register user
export const registerUser = async (data) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

// 🔐 Login user
export const loginUser = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};


// 📧 Forgot password
export const forgotPassword = async (email) => {
  const res = await axiosInstance.post("/auth/forgot-password", { email });
  return res.data;
};

// 🔑 Reset password
export const resetPassword = async (token, password) => {
  const res = await axiosInstance.put(
    `/auth/reset-password/${token}`,
    { password }
  );
  return res.data;
};

export const getMe = () => {
  return axiosInstance.get("/users/me");
};