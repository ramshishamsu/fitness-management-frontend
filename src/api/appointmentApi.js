import API from "./axios";

/*
|--------------------------------------------------------------------------
| APPOINTMENT APIs
|--------------------------------------------------------------------------
*/

export const bookAppointment = (data) =>
  API.post("/appointments", data);

export const getMyAppointments = () =>
  API.get("/appointments");

export const getTrainerAppointments = () =>
  API.get("/appointments/trainer");

export const approveAppointment = (id) =>
  API.put(`/appointments/${id}/approve`);

export const rejectAppointment = (id) =>
  API.put(`/appointments/${id}/reject`);

export const completeAppointment = (id) =>
  API.put(`/appointments/${id}/complete`);
