export const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgot_password: {
    url: "/api/user/forgot-password",
    method: "post",
  },
  verify_forgot_password_otp: {
    url: "/api/user/verify-forgot-password-otp",
    method: "post",
  },
  verify_email: {
    url: "/api/user/verify-email",
    method: "post",
  },
  logout: {
    url: "/api/user/logout",
    method: "post",
  },
  reset_password: {
    url: "/api/user/reset-password",
    method: "post",
  },
  userDetails: {
    url: "/api/user/details",
    method: "get",
  },
  uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "put",
  },
  updateUser: {
    url: "/api/user/update-user",
    method: "put",
  },
  // Profile-specific endpoints
  profile: {
    url: "/api/user/profile",
    method: "get",
  },
  profileUpdate: {
    url: "/api/user/profile/update",
    method: "put",
  },
  profileAvatar: {
    url: "/api/user/profile/avatar",
    method: "put",
  },
  profileStats: {
    url: "/api/user/profile/stats",
    method: "get",
  },
};

export default SummaryApi;
