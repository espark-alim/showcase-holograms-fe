import { IMAGES, SINGLE_IMAGE, UPLOAD_IMAGE } from "../api/apiEndPoints";
import { apiSlice } from "../api/apiSlice";

export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query({
      query: () => ({
        url: IMAGES,
        method: "GET",
      }),
    }),

    getSingleImage: builder.query({
      query: ({ id }) => ({
        url: `${SINGLE_IMAGE}${id}`,
        method: "GET",
      }),
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: UPLOAD_IMAGE,
        method: "POST",
        body: formData,
      }),
    }),

    adjustImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${SINGLE_IMAGE}${id}`,
        method: "POST",
        body: formData,
      }),
    }),

    deleteImage: builder.mutation({
      query: ({ id }) => ({
        url: `${SINGLE_IMAGE}${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetImagesQuery,
  useGetSingleImageQuery,
  useUploadImageMutation,
  useAdjustImageMutation,
  useDeleteImageMutation,
} = imageApiSlice;
