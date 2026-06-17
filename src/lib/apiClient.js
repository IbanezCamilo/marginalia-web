import { API_URL } from "./config";

let isRefreshing = false;
let pendingQueue = [];

function processQueue(error) {
    pendingQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve()
    );
    pendingQueue = [];
}

async function request(endpoint, options = {}) {
    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (response.status === 401) {
        if (endpoint === '/auth/refresh') {
            window.dispatchEvent(new CustomEvent('auth:session-expired'));
            throw new Error('Session expired');
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) =>
                pendingQueue.push({ resolve, reject })
            ).then(() => request(endpoint, options));
        }

        isRefreshing = true;
        try {
            const r = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!r.ok) throw new Error('Refresh failed');
            processQueue(null);
            return request(endpoint, options);
        } catch (err) {
            processQueue(err);
            window.dispatchEvent(new CustomEvent('auth:session-expired'));
            throw err;
        } finally {
            isRefreshing = false;
        }
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

export const apiClient = {
    get: (endpoint) =>
        request(endpoint, { method: 'GET' }),
    post: (endpoint, body) =>
        request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),
    put: (endpoint, body) =>
        request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),
    patch: (endpoint, body) =>
        request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        }),
    delete: (endpoint) =>
        request(endpoint, { method: 'DELETE' }),
    postForm: (endpoint, formData) =>
        request(endpoint, {
            method: "POST",
            body: formData,
        }),
};
