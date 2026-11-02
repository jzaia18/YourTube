// Hide Shorts: hides every Short on the homepage, the Subscriptions page, and the search results
// page (hide-shorts.css), each page with its own setting and its own attribute on <html>.
const hideShorts = (() => {
  const pages = [
    cssToggle("data-yourtube-hide-shorts-on-homepage", "hideShortsOnHomepage"),
    cssToggle("data-yourtube-hide-shorts-in-subscriptions", "hideShortsInSubscriptions"),
    cssToggle("data-yourtube-hide-shorts-in-search", "hideShortsInSearch"),
  ];
  return {
    apply(settings) {
      for (const page of pages) page.apply(settings);
    },
  };
})();
