import { BASE_URL } from '@/lib/config';

// For post cover images stored by filename
export const toCoverImageUrl = (filename) =>
  filename ? `${BASE_URL}/api/images/${encodeURIComponent(filename)}` : null;

// Normalized focal point (both axes in [0,1]) → a CSS `object-position` value.
// Falls back to center (50% 50%) when a coordinate is missing or invalid, so any
// surface degrades to today's center-crop behavior before a focal point is set.
export const focalToObjectPosition = (focalX, focalY) => {
  const clamp = (n) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.5);
  return `${clamp(focalX) * 100}% ${clamp(focalY) * 100}%`;
};

// For profile pictures — accepts a filename, an absolute URL, or a relative path
export const toProfileImageUrl = (picture) => {
  if (!picture) return null;
  if (picture.startsWith('http')) return picture;
  if (picture.startsWith('/')) return `${BASE_URL}${picture}`;
  return `${BASE_URL}/api/images/${encodeURIComponent(picture)}`;
};
