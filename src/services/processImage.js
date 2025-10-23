import { SUBMIT_IMAGES } from "../api/apiEndPoints";
import { apiSlice } from "../api/apiSlice";

export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitImages: builder.mutation({
      query: ({ id, body }) => ({
        url: `${SUBMIT_IMAGES}${id}`,
        method: "POST",
        body, // JSON
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const { useSubmitImagesMutation } = imageApiSlice;
