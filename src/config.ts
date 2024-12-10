export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const API_USERS_URL = `${API_BASE_URL}/api/users`
export const API_RESTAURANTS_URL = `${API_BASE_URL}/api/restaurants`
export const API_BOOKINGS_URL = `${API_BASE_URL}/api/bookings`
export const API_COMMENTS_URL = `${API_BASE_URL}/api/comments`
