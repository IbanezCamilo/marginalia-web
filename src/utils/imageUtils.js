import { BASE_URL } from '@/lib/config';

// For post cover images stored by filename
export const toCoverImageUrl = (filename) =>
  filename ? `${BASE_URL}/api/images/${encodeURIComponent(filename)}` : null;

// For profile pictures — accepts a filename, an absolute URL, or a relative path
export const toProfileImageUrl = (picture) => {
  if (!picture) return null;
  if (picture.startsWith('http')) return picture;
  if (picture.startsWith('/')) return `${BASE_URL}${picture}`;
  return `${BASE_URL}/api/images/${encodeURIComponent(picture)}`;
};
