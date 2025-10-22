import {
  CREATE_VIDEO,
  DETECT_FACE,
  REMOVE_BACKGROUND,
  SOLID_FILL,
} from "../api/apiEndPoints";
import { apiSlice } from "../api/apiSlice";

export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    removeBg: builder.mutation({
      query: (formData) => ({
        url: REMOVE_BACKGROUND,
        method: "POST",
        body: formData,
      }),
    }),
    solidFill: builder.mutation({
      query: (formData) => ({
        url: SOLID_FILL,
        method: "POST",
        body: formData,
      }),
    }),
    detectFace: builder.mutation({
      query: (formData) => ({
        url: DETECT_FACE,
        method: "POST",
        body: formData,
      }),
    }),
    createVideo: builder.mutation({
      query: (formData) => ({
        url: CREATE_VIDEO,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useRemoveBgMutation,
  useSolidFillMutation,
  useDetectFaceMutation,
  useCreateVideoMutation,
} = imageApiSlice;
