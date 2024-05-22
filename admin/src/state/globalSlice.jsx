import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false, 
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setIsAuthenticated } = globalSlice.actions;

export default globalSlice.reducer;
