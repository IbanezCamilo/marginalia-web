import { apiClient } from "@/lib/apiClient";

const BASE_ENDPOINT = "/me/preferences";

/** Wire key of the "email me on moderation status changes" preference. */
export const PREF_POST_MODERATION = "notifications.post-moderation";

/** Wire key of the "show my bio on my public profile" preference. */
export const PREF_SHOW_BIO = "privacy.show-bio";

/** Wire key of the "show my photo on my public profile" preference. */
export const PREF_SHOW_PHOTO = "privacy.show-photo";

export const preferencesService = {
  // The backend always returns the fully resolved map (defaults merged in).
  getPreferences: () => apiClient.get(BASE_ENDPOINT),

  updatePreferences: (changes) => apiClient.put(BASE_ENDPOINT, changes),
};
