import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  formType: "login", // "login" | "register"
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.formType = action.payload || "login";
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    switchForm: (state, action) => {
      state.formType = action.payload;
    },
  },
});

export const { openModal, closeModal, switchForm } = modalSlice.actions;
export default modalSlice.reducer;
