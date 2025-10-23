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
        method: "PATCH",
        body: data,
      }),
    }),

    editPhoto: builder.mutation({
      query: ({ id, data }) => ({
        url: `${REVIEWER_EDIT_PHOTO}${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    getPhotoById: builder.query({
      query: (id) => ({
        url: `${REVIEWER_GET_PHOTO_BY_ID}${id}`,
        method: "GET",
      }),
    }),

    deletePhotoById: builder.mutation({
      query: (id) => ({
        url: `${REVIEWER_DELETE_PHOTO_BY_ID}${id}`,
        method: "DELETE",
      }),
    }),

    createVideo: builder.mutation({
      query: (formData) => ({
        url: REVIEWER_CREATE_VIDEO,
        method: "POST",
        body: formData,
      }),
    }),

    getDashboard: builder.query({
      query: () => ({
        url: REVIEWER_DASHBOARD,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useReviewerLoginMutation,
  useUpdatePhotoStatusMutation,
  useEditPhotoMutation,
  useGetPhotoByIdQuery,
  useDeletePhotoByIdMutation,
  useCreateVideoMutation,
  useGetDashboardQuery,
} = reviewerApiSlice;
