// Builds a CSS-only feature: one that sets `attr` on <html> while YourTube is enabled and the
// boolean setting `settingKey` is on, and leaves all the work to CSS scoped under that attribute.
function cssToggle(attr, settingKey) {
  return {
    apply(settings) {
      document.documentElement.toggleAttribute(attr, settings.enabled && settings[settingKey]);
    },
  };
}
