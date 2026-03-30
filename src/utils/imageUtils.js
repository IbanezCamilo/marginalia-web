import { API_BASE_URL } from '../lib/apiClient';

/**
*Convert relative URL to absolute URL using API_BASE_URL, with optional fallback if url is falsy 
*/
export const toAbsoluteUrl = (url, fallback = '') => {
    if (!url) return fallback;
    return url;
};