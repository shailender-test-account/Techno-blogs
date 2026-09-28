import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  list: [], // { id, message, type: 'error' | 'success' | 'info' }
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert: {
      reducer: (state, action) => {
        state.list.push(action.payload);
      },
      prepare: (message, type = "error") => ({
        payload: { id: nanoid(), message, type },
      }),
    },
    removeAlert: (state, action) => {
      state.list = state.list.filter((a) => a.id !== action.payload);
    },
  },
});

export const { addAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
