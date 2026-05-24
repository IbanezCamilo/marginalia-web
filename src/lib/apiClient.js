import { API_URL } from "./config";

const getToken = () => localStorage.getItem('token');

//Core request handler 
async function request(endpoint, options = {}){
    const token = getToken();

    //Detect if body is FormData to avoid setting Content-Type (browser will set it with boundary)
    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(!isFormData && { "Content-Type": "application/json" }), // only set for non-FormData
        ...(token && { "Authorization": `Bearer ${token}` }), // only set if token exists
        ...options.headers, // allow overriding headers if needed
    }

    
    const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
});

//Session expired - redirect to login
if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
    throw new Error('Session expired');
}

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
}

//204 No Content - return null instead of trying to parse JSON
if (response.status === 204) return null;

return response.json();

}

//Convenience methods for common HTTP verbs
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


    // Separate method for multipart/form-data (image uploads)
    // Content-Type must NOT be set manually — browser sets it with boundary
    postForm: (endpoint, formData) =>
        request(endpoint, {
        method: "POST",
        body: formData,
        }),
}
