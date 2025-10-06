import axios from "axios";

// Store for selected entreprise
let selectedEntreprise = null;

export const setSelectedEntreprise = (id) => {
  selectedEntreprise = id;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add entrepriseId to requests when selected
api.interceptors.request.use((config) => {
  if (selectedEntreprise && !config.url?.includes('/auth/') && !config.url?.includes('/entreprises')) {
    if (config.method === 'get') {
      const separator = config.url.includes('?') ? '&' : '?';
      config.url += `${separator}entrepriseId=${selectedEntreprise}`;
    } else if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
      if (!config.data) config.data = {};
      if (typeof config.data === 'object' && !(config.data instanceof FormData)) {
        config.data.entrepriseId = selectedEntreprise;
      }
    }
  }
  return config;
});

// Wrapper for login to send motDePasse instead of password
export const login = async (email, password) => {
  return api.post("/auth/login", {
    email,
    motDePasse: password, // Use motDePasse to match backend expectation
  });
};

export default api;
