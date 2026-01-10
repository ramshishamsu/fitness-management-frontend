import API from "./axios";

/*
|--------------------------------------------------------------------------
| SUBSCRIPTION APIs
|--------------------------------------------------------------------------
*/


// Get logged-in user's active subscription
export const getMySubscription = () => {
  return API.get("/subscriptions/my");
};
