import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    openSubscriptionModal: (state) => {
      state.isOpen = true;
    },
    closeSubscriptionModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openSubscriptionModal, closeSubscriptionModal } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
