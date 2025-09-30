import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Wrapper for login to send motDePasse instead of password
export const login = async (email, password) => {
  return api.post("/auth/login", {
    email,
    motDePasse: password, // Use motDePasse to match backend expectation
  });
};

export default api;
