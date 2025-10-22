// import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "../api/apiSlice";
// import imagesReducer from "./slices/image/imageSlice";

// export const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     images: imagesReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
// });

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import imagesReducer from "./slices/image/imageSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage

// Persist config only for images slice
const persistConfig = {
  key: "images",
  storage,
};

// Wrap only the images reducer
const persistedImagesReducer = persistReducer(persistConfig, imagesReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    images: persistedImagesReducer, // persisted slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable for redux-persist compatibility
    }).concat(apiSlice.middleware),
});

// Create persistor
export const persistor = persistStore(store);
