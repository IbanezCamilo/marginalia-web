import { API_URL } from "./config";
import { ApiError } from "./apiError";

const DEFAULT_TIMEOUT_MS = 15000;

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    let response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
            signal: controller.signal,
        });
    } catch (err) {
        if (err.name === 'AbortError') {
            throw new ApiError({ kind: 'timeout', message: 'Request timed out' });
        }
        throw new ApiError({ kind: 'network', message: err.message });
    } finally {
        clearTimeout(timeoutId);
    }

    if (response.status === 401) {
        if (endpoint === '/auth/refresh') {
            window.dispatchEvent(new CustomEvent('auth:session-expired'));
            throw new ApiError({ kind: 'http', status: 401, message: 'Session expired' });
        }

        // Public, pre-auth endpoints: a 401 here means bad credentials, not an
        // expired access token — surface the backend's response as-is instead
        // of attempting a token refresh.
        if (endpoint === '/auth/login' || endpoint === '/auth/register') {
            const errorText = await response.text();
            let body = null;
            try {
                body = errorText ? JSON.parse(errorText) : null;
            } catch {
                body = null;
            }
            throw new ApiError({
                kind: 'http',
                status: response.status,
                body,
                message: errorText || `Request failed with status ${response.status}`,
            });
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
            if (!r.ok) throw new ApiError({ kind: 'http', status: r.status, message: 'Refresh failed' });
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
        let body = null;
        try {
            body = errorText ? JSON.parse(errorText) : null;
        } catch {
            body = null;
        }
        throw new ApiError({
            kind: 'http',
            status: response.status,
            body,
            message: errorText || `Request failed with status ${response.status}`,
        });
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
