// Smart API URL detection for Docker deployment with nginx reverse proxy
const getApiUrl = (): string => {
  // If VITE_API_URL is explicitly set, use it (for custom configurations)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Use relative URL - nginx reverse proxy will handle routing to backend
  // This works for both local and production deployments
  // Frontend: http://localhost:3000 → API: http://localhost:3000/api (proxied to backend:5000)
  // Frontend: http://server-ip:3000 → API: http://server-ip:3000/api (proxied to backend:5000)
  return window.location.origin;
};

const API_URL = getApiUrl();

export const config = {
  apiUrl: API_URL,
  uploadsUrl: `${API_URL}/uploads`,
};

export default config;
