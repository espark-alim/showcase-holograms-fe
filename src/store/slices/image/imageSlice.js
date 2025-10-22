// src/app/slices/image/imageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "images",
  initialState: {
    list: [],
  },
  reducers: {
    addImages: (state, action) => {
      state.list = action.payload;
    },
    addImage: (state, action) => {
      state.list.push(action.payload);
    },
    removeImage: (state, action) => {
      state.list = state.list.filter((img) => img.id !== action.payload);
    },
    clearImages: (state) => {
      state.list = [];
    },
  },
});

export const { addImages, addImage, removeImage, clearImages } =
  imageSlice.actions;

export default imageSlice.reducer;
