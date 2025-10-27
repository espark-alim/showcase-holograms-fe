import {
  IMAGES,
  SINGLE_IMAGE,
  UPLOAD_IMAGE,
  SUBMIT_IMAGES,
} from "../api/apiEndPoints";
import { apiSlice } from "../api/apiSlice";

export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query({
      query: ({ id }) => ({
        url: `${IMAGES}${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Images", id }],
    }),

    getSingleImage: builder.query({
      query: ({ id }) => ({
        url: `${SINGLE_IMAGE}${id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "SingleImage", id }],
    }),

    uploadImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${UPLOAD_IMAGE}${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Images", id }],
    }),

    adjustImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${SINGLE_IMAGE}${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SingleImage", id },
        { type: "Images", id },
      ],
    }),

    deleteImage: builder.mutation({
      query: ({ id }) => ({
        url: `${SINGLE_IMAGE}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Images", id }],
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
