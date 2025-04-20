//export const API_BASE_URL = "https://alumniverse.onrender.com";
export const API_BASE_URL = "http://localhost:5000";

export const API_ROUTES = {
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,

  GET_ALL_USERS: (id) => `${API_BASE_URL}/api/users/`,
  GET_CURRENT_USER: (id) => `${API_BASE_URL}/api/users/me`,

  MAKE_COMMUNITY_POST: (id) => `${API_BASE_URL}/api/posts/`,
  GET_ALL_POSTS: (id) => `${API_BASE_URL}/api/posts/`,
  LIKE_POST: (post_id) => `${API_BASE_URL}/api/posts/like/${post_id}`,
  COMMENT_ON_POST: (post_id) => `${API_BASE_URL}/api/posts/comment/${post_id}`,

  UPDATE_USER_PROFILE: (id) => `${API_BASE_URL}/api/users/all`,
  GET_ALL_ACHIEVEMENTS: (id) =>
    `${API_BASE_URL}/api/achievements/allAchievements`,
  GET_USER_PROFILE: (id) => `${API_BASE_URL}/api/users/${id}`,

  UPDATE_USER_PROFILE_IMAGE_ONLY: (id) =>
    `${API_BASE_URL}/api/users/upload/profile-image`,
};
