const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") || "";

export const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : "/api";