// Smart API URL detection for both local and production Docker environments
const getApiUrl = (): string => {
  // If VITE_API_URL is explicitly set, use it (for custom configurations)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Auto-detect API URL based on current browser location
  // Works for both local (localhost) and production (server IP/domain)
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname; // localhost, 192.168.x.x, or domain
  const apiPort = '5000'; // Backend always runs on port 5000

  return `${protocol}//${hostname}:${apiPort}`;
};

const API_URL = getApiUrl();

export const config = {
  apiUrl: API_URL,
  uploadsUrl: `${API_URL}/uploads`,
};

export default config;
