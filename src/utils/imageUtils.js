// src/utils/imageUtils.js
import { BASE_URL } from '../data/apiClient';

/**
*Convert relative URL to absolute URL using BASE_URL, with optional fallback if url is falsy 
*/
export const toAbsoluteUrl = (url, fallback = '') => {
    if (!url) return fallback;
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};