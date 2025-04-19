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
    const headers = {};

    // Include token if needed
    if (authRequired) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.log("❌ Access token not found");
        return;
      }
    }

    const options = {
      method,
      headers,
    };

    // Handle body differently for FormData and JSON
    if (body && method !== "GET") {
      if (body instanceof FormData) {
        options.body = body; // let browser set correct Content-Type and boundary
      } else {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(endpoint, options);
    console.log(`✅ Response status from ${endpoint}: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`🔥 Error in API call to ${endpoint}:`, error.message);
    throw error;
  }
};


export const updateUserProfile = async (body) => {
  return await apiCall(API_ROUTES.UPDATE_USER_PROFILE(), "PUT", body);
};