// Default settings, shared by the service worker and the popup (both load ES modules).
// Content scripts can't `import`, so content.js keeps its own copy of the keys it reads.
export const DEFAULT_SETTINGS = {
  enabled: true,
};
