/**
 * api.js — Centralized API utility untuk Tech-Hire System
 * 
 * Semua request ke backend Node.js (:5000) harus melewati helper ini
 * agar Authorization header JWT otomatis disertakan.
 */

export const BACKEND_URL = "http://localhost:5000";
export const AI_URL      = "http://localhost:8000";

/**
 * Ambil JWT token dari localStorage.
 */
const getToken = () => localStorage.getItem("techhire_token");

/**
 * Lakukan request ke backend dengan JWT header otomatis.
 * Jika token habis/invalid (401/403), otomatis logout.
 */
export const apiFetch = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  // Jika token tidak valid pada request biasa → paksa logout
  // JANGAN reload jika sedang melakukan login/register (/auth/)
  if ((res.status === 401 || res.status === 403) && !path.includes("/auth/")) {
    localStorage.removeItem("techhire_token");
    localStorage.removeItem("techhire_user");
    window.location.reload(); // Reload akan trigger redirect ke login
    return res;
  }

  return res;
};

/**
 * Helper khusus untuk multipart/form-data (upload file ke AI).
 * Tidak set Content-Type agar browser bisa set boundary sendiri.
 */
export const aiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${AI_URL}${path}`, {
    ...options,
    headers,
  });
};
