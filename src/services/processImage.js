import { SUBMIT_IMAGES } from "../api/apiEndPoints";
import { apiSlice } from "../api/apiSlice";

export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitImages: builder.mutation({
      query: (formData) => ({
        url: SUBMIT_IMAGES,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useSubmitImagesMutation } = imageApiSlice;
