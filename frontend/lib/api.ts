export const getApiUrl = () => {
  // 1. If running on Server (node), use BACKEND_URL (Docker network access)
  // 2. If running on Client (browser), use NEXT_PUBLIC_API_URL
  if (typeof window === "undefined") {
    return process.env.BACKEND_URL || "http://backend:8000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

// Helper for making API requests that automatically handles the base URL
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getApiUrl();
  // Ensure endpoint starts with / if not present
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  return res;
}

export async function getProducts() {
  const res = await fetchAPI("products");
  return res.json();
}

export async function getProjects() {
  const res = await fetchAPI("projects");
  return res.json();
}