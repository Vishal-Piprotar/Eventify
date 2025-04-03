import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth APIs
export const registerUser = (userData) => api.post("/auth/register", userData).then(res => res.data);
export const loginUser = (credentials) => api.post("/auth/login", credentials).then(res => res.data);
export const getUserProfile = () => api.get("/auth/profile").then(res => res.data);
export const editUserProfile = (profileData) => api.put("/auth/profile", profileData).then(res => res.data);
export const changePassword = (passwordData) => api.put("/auth/change-password", passwordData).then(res => res.data); 
export const deleteUserAccount = () => api.delete("/auth/profile").then((res) => res.data);


// Event APIs
export const fetchEvents = () => api.get("/events").then(res => res.data);
export const getEventById = (eventId) => api.get(`/events/${eventId}`).then(res => res.data);
export const createEvent = (eventData) => api.post("/events", eventData).then(res => res.data);
export const updateEvent = (eventId, eventData) => api.put(`/events/${eventId}`, eventData).then(res => res.data);
export const deleteEvent = (eventId) => api.delete(`/events/${eventId}`).then(res => res.data);
export const fetchMyEvents = () => api.get("/events/my-events").then(res => res.data);
export const getEventAttendees = (eventId) => api.get(`/events/${eventId}/attendees`).then(res => res.data);