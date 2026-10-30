// Hide Ask button: hides YouTube's AI "Ask" button on the watch page. Pure CSS
// (hide-ask-button.css), switched on and off by an attribute on <html>.
const hideAskButton = (() => {
  const ACTIVE_ATTR = "data-ourtube-hide-ask-button";

  function apply(settings) {
    document.documentElement.toggleAttribute(ACTIVE_ATTR, settings.enabled && settings.hideAskButton);
  }

  return { apply };
})();
