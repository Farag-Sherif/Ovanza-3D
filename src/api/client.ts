import axios from "axios";

// Existing backend contract — DO NOT MODIFY endpoints or payloads.
export const API_BASE = "https://admin.ovanzacosmetics.com/api";
export const CDN_BASE = "https://admin.ovanzacosmetics.com";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

export default axiosInstance;

/** Resolve a raw filename (or passthrough a full URL) into a CDN URL. */
export function cdnUrl(file?: string | null, kind: "images" | "storage" = "images"): string | null {
  if (!file) return null;
  if (/^https?:\/\//i.test(file)) return file;
  if (kind === "storage") return `${CDN_BASE}/storage/app/public/${file}`;
  return `${CDN_BASE}/images/${file}`;
}

/** Strip HTML tags from API rich text and return safe plain text. */
export function stripHtml(html?: string | null): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.textContent === "" ? div.textContent : "").trim();
}
