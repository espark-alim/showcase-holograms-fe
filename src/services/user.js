import { ADD_USER } from "../api/apiEndPoints";
import { apiSlice } from "../api/apiSlice";

export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (formData) => ({
        url: ADD_USER,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useAddUserMutation } = imageApiSlice;
