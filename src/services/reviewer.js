import {
  REVIEWER_UPDATE_PHOTO_STATUS,
  REVIEWER_EDIT_PHOTO,
  REVIEWER_GET_PHOTO_BY_ID,
  REVIEWER_DELETE_PHOTO_BY_ID,
  REVIEWER_CREATE_VIDEO,
  REVIEWER_DASHBOARD,
  REVIEWER_LOGIN,
} from "../api/apiEndPoints";

import { apiSlice } from "../api/apiSlice";

export const reviewerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reviewerLogin: builder.mutation({
      query: (formData) => ({
        url: REVIEWER_LOGIN,
        method: "POST",
        body: formData,
      }),
    }),

    updatePhotoStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `${REVIEWER_UPDATE_PHOTO_STATUS}${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    getDashboard: builder.query({
      query: () => ({
        url: REVIEWER_DASHBOARD,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      providesTags: ["users"],
    }),

    getImageById: builder.query({
      query: ({ id }) => ({
        url: `${REVIEWER_GET_PHOTO_BY_ID}${id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["single-image"],
    }),

    editImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${REVIEWER_EDIT_PHOTO}${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["single-image"],
    }),

    deleteImageForReviewer: builder.mutation({
      query: ({ id }) => ({
        url: `${REVIEWER_DELETE_PHOTO_BY_ID}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    createVideo: builder.mutation({
      query: ({ body }) => ({
        url: `${REVIEWER_CREATE_VIDEO}`,
        method: "POST",
        body, // JSON
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const {
  useReviewerLoginMutation,
  useUpdatePhotoStatusMutation,
  useEditImageMutation,
  useGetImageByIdQuery,
  useDeleteImageForReviewerMutation,
  useCreateVideoMutation,
  useGetDashboardQuery,
} = reviewerApiSlice;
