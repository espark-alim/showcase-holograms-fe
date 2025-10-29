import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, prepareHeaders } from "../services/_utils";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders,
});

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const status = result?.error?.status;
  if (status === 401) {
    // api.dispatch(logout());
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Images", "users"],
  endpoints: () => ({}),
});
