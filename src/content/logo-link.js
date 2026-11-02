// Logo link: sends the YouTube logo to the user's chosen logo destination.
// YouTube's own logo is hidden with CSS (logo-link.css) and an identical-looking plain
// link is inserted beside it. YouTube's element and its click handling stay untouched, so
// a plain click on our link is an ordinary full page load.
const logoLink = (() => {
  const ACTIVE_ATTR = "data-yourtube-logo-link";
  const COPY_CLASS = "yourtube-logo-link";
  const { LOGO_DESTINATIONS } = yourtubeLogoLink; // src/shared/logo-link.js, listed before this script
  // Where each YouTube site renders its logo. Per site, within the `host` element:
  // `original` is what gets hidden (mirrored in logo-link.css) with the copy placed right
  // after it, null meaning the host itself; `box` is the element whose size the copy matches.
  // Embedded players have no logo.
  const SITES = [
    {
      // www.youtube.com: top bar and slide-out menu. The country code sits after the link.
      host: "ytd-topbar-logo-renderer",
      original: ":scope > a#logo",
      box: ":scope > a#logo",
      icon: "#logo-icon",
      iconClass: "ytIconWrapperHost ytd-logo", // YouTube's own class, so its CSS supplies the theme colour
    },
    {
      // m.youtube.com: the logo is a button acting as a link, and YouTube handles clicks
      // anywhere in ytm-home-logo, so the copy must sit outside it.
      host: "ytm-home-logo",
      original: null,
      box: ":scope > .mobile-topbar-header-endpoint",
      icon: "#home-icon",
      iconClass: "mobile-topbar-logo full-logo",
    },
  ];

  let target = null; // { href, label } while the feature is active
  let pageObserver = null;
  const logoObservers = new Map(); // logo host element -> MutationObserver
  const copies = new Map(); // logo host element -> its copy
  const artworkSignatures = new WeakMap(); // copy -> what its artwork was built from

  // While the Master switch is off, content.js passes logoDestination "homepage": no target.
  function resolveTarget(settings) {
    if (settings.logoDestination !== "custom") {
      const destination = LOGO_DESTINATIONS[settings.logoDestination];
      return destination?.path ? { href: destination.path, label: destination.label } : null;
    }
    // The popup already normalized this; only confirm it stays on this site.
    const path = settings.logoCustomPath;
    if (typeof path !== "string" || !path.startsWith("/")) return null;
    if (new URL(path, location.origin).origin !== location.origin) return null;
    return { href: path, label: `YouTube: ${path}` };
  }

  function apply(settings) {
    const next = resolveTarget(settings);
    if (next?.href === target?.href && next?.label === target?.label) return;
    target = next;
    if (target) {
      document.documentElement.setAttribute(ACTIVE_ATTR, "");
      start();
    } else {
      stop();
      document.documentElement.removeAttribute(ACTIVE_ATTR);
    }
  }

  // Runs `fn` at most once per frame, and only while the feature is active.
  function perFrame(fn) {
    let queued = false;
    return () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (target) fn();
      });
    };
  }
  const queueScan = perFrame(scan);
  // The copy's sizes are copied from YouTube's logo, which YouTube's media queries change as
  // the window resizes, so copy them again.
  const queueSyncAll = perFrame(syncAll);

  // YouTube renders its logos lazily and may re-render them, so watch for new ones and
  // keep each copy in sync with its original.
  function start() {
    pageObserver ??= new MutationObserver(queueScan);
    pageObserver.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("resize", queueSyncAll);
    scan();
    syncAll();
  }

  function stop() {
    pageObserver?.disconnect();
    window.removeEventListener("resize", queueSyncAll);
    logoObservers.forEach((observer) => observer.disconnect());
    logoObservers.clear();
    copies.clear();
    document.querySelectorAll(`a.${COPY_CLASS}`).forEach((copy) => copy.remove());
  }

  function syncAll() {
    for (const site of SITES) {
      for (const host of document.getElementsByTagName(site.host)) sync(host, site);
    }
  }

  function scan() {
    for (const [host, observer] of logoObservers) {
      if (!host.isConnected) {
        observer.disconnect();
        logoObservers.delete(host);
        copies.get(host)?.remove();
        copies.delete(host);
      }
    }
    for (const site of SITES) {
      for (const host of document.getElementsByTagName(site.host)) {
        if (logoObservers.has(host)) continue;
        const observer = new MutationObserver(() => target && sync(host, site));
        observer.observe(host, { childList: true, subtree: true, attributes: true, characterData: true });
        logoObservers.set(host, observer);
        sync(host, site);
      }
    }
  }

  // Idempotent: only touches the DOM when something differs, so the mutations it causes
  // settle after one extra observer callback.
  function sync(host, site) {
    const original = site.original ? host.querySelector(site.original) : host;
    const box = host.querySelector(site.box);
    let copy = copies.get(host);
    if (!original || !box) {
      copy?.remove();
      copies.delete(host);
      return;
    }
    if (!copy) {
      copy = document.createElement("a");
      copy.className = COPY_CLASS;
      copies.set(host, copy);
    }
    if (original.nextElementSibling !== copy) original.after(copy);

    setAttribute(copy, "href", target.href);
    setAttribute(copy, "title", target.label);
    setAttribute(copy, "aria-label", target.label);
    // Computed styles resolve even while the original is hidden.
    const boxStyle = getComputedStyle(box);
    for (const property of ["padding", "margin", "height"]) {
      if (copy.style[property] !== boxStyle[property]) copy.style[property] = boxStyle[property];
    }

    const artwork = buildArtwork(host, site);
    const signature = artwork?.outerHTML ?? "";
    if (artworkSignatures.get(copy) !== signature) {
      artworkSignatures.set(copy, signature);
      copy.replaceChildren(...(artwork ? [artwork] : []));
    }
  }

  function setAttribute(element, name, value) {
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  }

  // Rebuilds the logo YouTube is currently showing (a doodle image if one is up, otherwise
  // the wordmark SVG, whichever variant the user gets) out of plain, non-YouTube elements.
  function buildArtwork(host, site) {
    const icon = host.querySelector(site.icon);
    const doodle = host.querySelector("ytd-yoodle-renderer:not([hidden]) img[src]:not([src=''])");
    const source = doodle ?? icon?.querySelector("svg");
    if (!source) return null;

    const box = document.createElement("span");
    box.className = `${site.iconClass} yourtube-logo-icon`;
    const sized = doodle ?? icon;
    const style = getComputedStyle(sized);
    box.style.width = style.width;
    box.style.height = style.height;
    box.style.padding = doodle ? "0" : style.padding;
    box.append(withUniqueIds(source.cloneNode(true)));
    return box;
  }

  // Cloned SVGs would duplicate YouTube's ids (and their url(#id) references), so prefix them.
  function withUniqueIds(root) {
    const ids = [root, ...root.querySelectorAll("[id]")].filter((el) => el.id).map((el) => el.id);
    for (const element of [root, ...root.querySelectorAll("*")]) {
      for (const attr of [...element.attributes]) {
        let value = attr.value;
        if (attr.name === "id") value = `yourtube-${value}`;
        for (const id of ids) {
          value = value.replaceAll(`url(#${id})`, `url(#yourtube-${id})`);
          if (value === `#${id}`) value = `#yourtube-${id}`;
        }
        if (value !== attr.value) element.setAttribute(attr.name, value);
      }
    }
    return root;
  }

  return { apply };
})();
