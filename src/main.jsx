import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

ReactDOM.createRoot(document.getElementById("root")).render(
   <BrowserRouter>
    <AuthProvider>
      <Elements stripe={stripePromise}>
      <App />
      </Elements>
    </AuthProvider>
  </BrowserRouter>
);
