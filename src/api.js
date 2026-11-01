const productionApiUrl = import.meta.env.PROD
  ? "https://my-monolith-backend.onrender.com"
  : "";

export const apiBaseUrl = (import.meta.env.VITE_API_URL || productionApiUrl).replace(/\/+$/, "");
