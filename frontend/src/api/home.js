import { API_ROUTES } from "../routes/apiRoute";

/**
 * A reusable function to make API calls
 * @param {string} endpoint - The API endpoint to call (from API_ROUTES)
 * @param {string} method - HTTP method ('GET', 'POST', etc.)
 * @param {object} body - Request body (for POST, PUT, etc.), optional
 * @param {boolean} authRequired - Whether to include Authorization header, default is true
 * @returns {Promise<object>} - The API response JSON
 */
const apiCall = async (
  endpoint,
  method = "GET",
  body = null,
  authRequired = true
) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // If authentication is required, include the bearer token
    if (authRequired) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      else{
        console.log("Error Access token not found");
        return;
      }
    }

    const options = {
      method,
      headers,
    };

    // Add the request body if it's not a GET request
    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);
    console.log(`Response to ${endpoint} is ${response}`)

    // Check for errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error.message);
    throw error;
  }
};


export const makeCommunityPost = async (body) => { 
  return await apiCall(API_ROUTES.MAKE_COMMUNITY_POST(), "POST", body);
};

export const getAllPosts = async (body) => {
  return await apiCall(API_ROUTES.GET_ALL_POSTS());  // GET REQUEST
};

export const likePost = async (post_id) => {
  return await apiCall(API_ROUTES.LIKE_POST(post_id), "PUT"); // GET REQUEST
};

export const commentOnPost = async (post_id, body) => {
  return await apiCall(API_ROUTES.COMMENT_ON_POST(post_id), "POST", body);
};