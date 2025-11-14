export const API_BASE_URL = "http://localhost:8080";

export function apiFetch(path, options = {}) {
    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });
}
