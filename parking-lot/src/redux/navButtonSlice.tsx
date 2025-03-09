import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
  signup: false,
  logout: false,
};

const navButtonSlice = createSlice({
  name: "navbuttons",
  initialState,
  reducers: {
    togglelogin: (state,action) => {
      state.login = action.payload;
    },
    togglelogout: (state,action) => {
      state.logout = action.payload;
    },
    togglesignup: (state,action) => {
      state.signup = action.payload;
    },
  },
});

export const { togglelogin,togglesignup,togglelogout }=navButtonSlice.actions;
export default navButtonSlice.reducer;
