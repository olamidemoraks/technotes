import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://technotes-api-nq49.onrender.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (arg, api, extraOptions) => {
  let result = await baseQuery(arg, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log("Sending refresh token");

    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      api.dispatch(setCredentials({ ...refreshResult?.data }));

      result = await baseQuery(arg, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 404) {
        refreshResult.error.data.message = "Your login has expire";
      }
      return refreshResult;
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
