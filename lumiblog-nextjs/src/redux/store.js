import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import alertReducer from "./slices/alertSlice";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";
import subscriptionReducer from "./slices/subscriptionslice";


export const store = configureStore({
  reducer: {
    modal: modalReducer,
    alerts: alertReducer,
    ui: uiReducer,
    auth: authReducer,
    subscription: subscriptionReducer,

  },
});
