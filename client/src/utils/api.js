import axios from "axios";

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance with the base URL
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Request interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login on unauthorized
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Authentication APIs
export const registerUser = (userData) =>
  api.post("/auth/register", userData).then((res) => res.data);

export const loginUser = (credentials) =>
  api.post("/auth/login", credentials).then((res) => res.data);

export const getUserProfile = () =>
  api.get("/auth/profile").then((res) => res.data);

export const editUserProfile = (profileData) =>
  api.put("/auth/profile", profileData).then((res) => res.data);
  

// Event APIs
export const fetchEvents = () => api.get("/events").then((res) => res.data);

export const getEventById = (eventId) =>
  api.get(`/events/${eventId}`).then((res) => res.data);

export const createEvent = (eventData) =>
  api.post("/events", eventData).then((res) => res.data);

export const updateEvent = (eventId, eventData) =>
  api.put(`/events/${eventId}`, eventData).then((res) => res.data);

export const deleteEvent = (eventId) =>
  api.delete(`/events/${eventId}`).then((res) => res.data);

export const getEventAttendees = (eventId) =>
  api.get(`/events/${eventId}/attendees`).then((res) => res.data);

export const registerForEvent = (eventId, userData = {}) =>
  api.post(`/events/${eventId}/register`, userData).then((res) => res.data);

export const toggleEventLike = (eventId, liked) =>
  api.post(`/events/${eventId}/like`, { liked }).then((res) => res.data);

// User Management APIs
export const fetchUsers = () => api.get("/users").then((res) => res.data);

export const getUserById = (userId) =>
  api.get(`/users/${userId}`).then((res) => res.data);

export const updateUser = (userId, userData) =>
  api.put(`/users/${userId}`, userData).then((res) => res.data);

export const deleteUser = (userId) =>
  api.delete(`/users/${userId}`).then((res) => res.data);

// // Notification API (assuming it exists in backend)
// export const fetchNotifications = () =>
//   api.get("/notifications").then((res) => res.data);