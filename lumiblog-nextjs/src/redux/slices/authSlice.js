import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  
  isAuthenticated: false,
  currentuser:null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setUser: (state, action) => {
      state.currentuser = action.payload;
      // state.isAuthenticated = true;
    
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, registerSuccess, logout,setUser} = authSlice.actions;
export default authSlice.reducer;
