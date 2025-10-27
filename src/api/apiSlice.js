import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_BASE;

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "omit",
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // global error handling (optional)
  if (result?.error) {
    const status = result.error.status;

    if (status === 500) {
      toast.error("Internal server error. Please try again later.");
    }

    // if (status === 404) {
    //   toast.error("Resource not found.");
    // }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api", // optional, default bhi chalega
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Images", "SingleImage"],
  endpoints: () => ({}),
});
