import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => (
    value !== undefined && value !== null && value !== ""
  ));

  const query = new URLSearchParams(entries).toString();
  return query ? `?${query}` : "";
};

export const backendAPI = createApi({
  reducerPath: "backendAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Property",
    "MyProperty",
    "AdminProperty",
    "Lead",
    "AdminLead",
    "AdminUser",
    "AdminBroker",
    "AdminStats",
    "Agent",
  ],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: credentials,
      }),
    }),
    logIn: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: credentials,
      }),
    }),

    getProperties: builder.query({
      query: (params = {}) => `/properties${buildQueryString(params)}`,
      providesTags: ["Property"],
    }),
    getPropertyById: builder.query({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),
    getMyProperties: builder.query({
      query: () => "/properties/my",
      providesTags: ["MyProperty"],
    }),
    createProperty: builder.mutation({
      query: (formData) => ({ url: "/properties", method: "POST", body: formData }),
      invalidatesTags: ["Property", "MyProperty"],
    }),
    updateProperty: builder.mutation({
      query: ({ id, formData }) => ({ url: `/properties/${id}`, method: "PUT", body: formData }),
      invalidatesTags: ["Property", "MyProperty"],
    }),
    deleteMyProperty: builder.mutation({
      query: (id) => ({ url: `/properties/${id}`, method: "DELETE" }),
      invalidatesTags: ["Property", "MyProperty"],
    }),

    submitLead: builder.mutation({
      query: ({ propertyId, ...body }) => ({
        url: `/properties/${propertyId}/lead`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: ["Lead"],
    }),
    getMyLeads: builder.query({
      query: () => "/leads/my",
      providesTags: ["Lead"],
    }),
    updateLeadStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/leads/${id}/status`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { status },
      }),
      invalidatesTags: ["Lead"],
    }),

    getAdminStats: builder.query({
      query: () => "/admin/stats",
      providesTags: ["AdminStats"],
    }),
    getAdminProperties: builder.query({
      query: (params = {}) => `/admin/properties${buildQueryString(params)}`,
      providesTags: ["AdminProperty"],
    }),
    approveProperty: builder.mutation({
      query: (id) => ({ url: `/admin/properties/${id}/approve`, method: "PUT" }),
      invalidatesTags: ["AdminProperty", "Property", "AdminStats", "AdminBroker"],
    }),
    rejectProperty: builder.mutation({
      query: (id) => ({ url: `/admin/properties/${id}/reject`, method: "PUT" }),
      invalidatesTags: ["AdminProperty", "Property", "AdminStats", "AdminBroker"],
    }),
    adminDeleteProperty: builder.mutation({
      query: (id) => ({ url: `/admin/properties/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminProperty", "Property", "AdminLead", "AdminStats", "AdminBroker"],
    }),
    getAdminUsers: builder.query({
      query: (params = {}) => `/admin/users${buildQueryString(params)}`,
      providesTags: ["AdminUser"],
    }),
    getAdminUserById: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: "AdminUser", id }],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { role },
      }),
      invalidatesTags: ["AdminUser", "AdminStats", "AdminBroker"],
    }),
    deleteAdminUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminUser", "AdminProperty", "AdminLead", "AdminStats", "AdminBroker"],
    }),
    getAdminLeads: builder.query({
      query: (params = {}) => `/admin/leads${buildQueryString(params)}`,
      providesTags: ["AdminLead"],
    }),
    getAdminBrokers: builder.query({
      query: (params = {}) => `/admin/brokers${buildQueryString(params)}`,
      providesTags: ["AdminBroker"],
    }),

    // ── Agents (public marketplace) ──────────────────────────────────────────
    getAgents: builder.query({
      query: (params = {}) => `/agents${buildQueryString(params)}`,
      providesTags: ["Agent"],
    }),
    getAgentProfile: builder.query({
      query: (id) => `/agents/${id}`,
      providesTags: (result, error, id) => [{ type: "Agent", id }],
    }),
    getAgentStats: builder.query({
      query: (id) => `/agents/${id}/stats`,
      providesTags: (result, error, id) => [{ type: "Agent", id }],
    }),
    updateBrokerProfile: builder.mutation({
      query: (body) => ({ url: "/agents/profile", method: "PUT", headers: { "Content-Type": "application/json" }, body }),
      invalidatesTags: ["Agent"],
    }),
    getAgentReviews: builder.query({
      query: (id) => `/agents/${id}/reviews`,
      providesTags: (result, error, id) => [{ type: "Agent", id }],
    }),
    addAgentReview: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/agents/${id}/reviews`, method: "POST", headers: { "Content-Type": "application/json" }, body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Agent", id }, "Agent"],
    }),
    verifyBroker: builder.mutation({
      query: (id) => ({ url: `/agents/${id}/verify`, method: "PUT" }),
      invalidatesTags: ["Agent", "AdminBroker"],
    }),
    toggleBlockBroker: builder.mutation({
      query: (id) => ({ url: `/agents/${id}/block`, method: "PUT" }),
      invalidatesTags: ["Agent", "AdminBroker"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLogInMutation,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetMyPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeleteMyPropertyMutation,
  useSubmitLeadMutation,
  useGetMyLeadsQuery,
  useUpdateLeadStatusMutation,
  useGetAdminStatsQuery,
  useGetAdminPropertiesQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useAdminDeletePropertyMutation,
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useUpdateUserRoleMutation,
  useDeleteAdminUserMutation,
  useGetAdminLeadsQuery,
  useGetAdminBrokersQuery,
  useGetAgentsQuery,
  useGetAgentProfileQuery,
  useGetAgentStatsQuery,
  useUpdateBrokerProfileMutation,
  useGetAgentReviewsQuery,
  useAddAgentReviewMutation,
  useVerifyBrokerMutation,
  useToggleBlockBrokerMutation,
} = backendAPI;
