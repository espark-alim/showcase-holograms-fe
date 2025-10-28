// src/app/slices/image/imageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "reviewer",
  initialState: {
    current: {},
  },
  reducers: {
    addReviewer: (state, action) => {
      state.current = action.payload;
    },
    logout: (state) => {
      state.current = null;
      localStorage.clear();
    },
  },
});

export const { addReviewer, logout } = imageSlice.actions;

export default imageSlice.reducer;
