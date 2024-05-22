import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from './config';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: config.API_URL }),

  endpoints: (builder) => ({
    // User Authentication
    checkAccountExists: builder.mutation({
      query: ({ email }) => ({
        url: '/check-account',
        method: 'POST',
        body: { email },
      }),
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: credentials,
      }),
    }),

    verifyToken: builder.mutation({
      query: (token) => ({
        url: '/verify',
        method: 'POST',
        headers: { 'jwt-token': token },
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userId, updatedData }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: updatedData,
      }),
    }),
  }),
});

// Export hooks for your operations
export const {
  // User Authentication
  useCheckAccountExistsMutation,
  useLoginUserMutation,
  useVerifyTokenMutation,
  useUpdateUserMutation
} = apiSlice;

