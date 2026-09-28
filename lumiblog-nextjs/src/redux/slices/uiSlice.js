import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  successOverlay: {
    visible: false,
    title: "",
    message: "",
    withConfetti: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showSuccessOverlay: (state, action) => {
      state.successOverlay = {
        visible: true,
        title: action.payload.title || "Success!",
        message: action.payload.message || "",
        withConfetti: !!action.payload.withConfetti,
      };
    },
    hideSuccessOverlay: (state) => {
      state.successOverlay.visible = false;
    },
  },
});

export const { showSuccessOverlay, hideSuccessOverlay } = uiSlice.actions;
export default uiSlice.reducer;
