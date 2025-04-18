const API_BASE_URL = "http://localhost:5000";

export const API_ROUTES = {
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,

  GET_ALL_USERS: `${API_BASE_URL}/api/users/`,
  GET_CURRENT_USER: `${API_BASE_URL}/api/users/me`,

  COMMUNITY_POST: `${API_BASE_URL}/api/posts/`,
  
  
};
