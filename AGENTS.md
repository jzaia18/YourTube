# OurTube

Browser extension (Manifest V3, Chrome and Firefox) that rewrites the YouTube UI on www.youtube.com, m.youtube.com, and www.youtube-nocookie.com. Plain JS/CSS loaded directly by the browser: no build step, no bundler, no dependencies. Keep it that way unless the owner asks otherwise.

## Principles

Every change upholds all of these; a feature request that conflicts with one goes back to the owner before any code is written. `README.md` carries a short user-facing summary of these principles; update it whenever this list changes.

1. **Every behaviour is configurable.** Each feature ships with its own setting to disable it, added in the same change as the feature. Settings are clear and intuitive: labelled by the visible effect on YouTube in plain language, not by implementation names. The default (on or off) varies per feature: ask the owner when creating each one. Toggling a setting takes effect immediately in every open YouTube tab, with no reload.
2. **Unimposing.** Changes to the page are minimal and blend into YouTube's design; at a glance the altered page is still obviously YouTube. Build added UI from YouTube's own look: its `--yt-spec-*` CSS variables (which also track light/dark theme), fonts, spacing, and existing element patterns, rather than a separate OurTube style.
3. **Works logged in and logged out.** Every feature works for both. YouTube serves different markup and content to each (e.g. sign-in prompts, no subscriptions or history, a sparse home feed when logged out), so verify features in both states.
4. **Aesthetic only.** The extension changes how the page renders on the user's screen; it never sends, alters, or blocks requests on its own. Every request YouTube receives comes from the user's own deliberate navigation, to a page they could visit anyway (a restyled link may lead somewhere new). Leave YouTube's own JS, network traffic, and user actions untouched: no intercepting or modifying requests, no requests made on the user's behalf, no synthetic clicks or other interactions with YouTube controls. Prefer hiding elements with CSS over removing them from the DOM, so YouTube's scripts keep seeing the page they built.
5. **Chrome and Firefox.** Every feature works in both browsers from one codebase. Use only WebExtension APIs and manifest keys both support and verify features in both. Call extension APIs through the promise-based `browser.*` namespace, native to Firefox and available in Chrome 148+.
6. **Every YouTube site.** Features work on www.youtube.com (desktop), m.youtube.com (mobile), and www.youtube-nocookie.com (embedded players), wherever the UI they change exists. Each site has its own markup, so handle and verify each.

## Execution contexts

Each directory under `src/` runs in a different extension context with different powers; put code where its context can run it.

- `src/content/` — injected into every top-level page on the YouTube sites in `content_scripts.matches` (currently www and m). No feature targets embedded players yet; the first one adds `https://www.youtube-nocookie.com/*` to `matches` and sets `all_frames` (embeds live in iframes on other websites), and from then on a feature that only exists on top-level pages returns early when `window !== window.top`. Shares the page's DOM but runs in an isolated JS world (YouTube's own JS globals are invisible). Loaded as classic scripts, so `import` is unavailable, but scripts listed together in `manifest.json` share one global scope. Each feature is its own `<feature>.js` (+ optional `<feature>.css`), listed before `content.js` and defining one top-level const object with an idempotent `apply(settings)`, called on load and on every settings change; add it to `FEATURES` in `content.js`. Only a subset of `browser.*` APIs works here (`storage`, `runtime`).
- `src/background/` — one ES module that runs as a service worker in Chrome and as an event page in Firefox (`manifest.json` declares it under both `service_worker` and `scripts`; each browser ignores the other key). Write it to the service-worker subset: no DOM access, and the browser unloads it when idle, so state lives in `browser.storage`, never in module variables. Register listeners synchronously at top level.
- `src/popup/` — toolbar popup page (ES module). Recreated every time it opens.
- `src/shared/` — ES modules importable by background and popup only.

Settings flow through `browser.storage.sync`: defaults in `src/shared/settings.js` (mirrored by hand in `content.js`), the popup writes, content scripts react via `browser.storage.onChanged`. Every value a content script copies from `src/shared/` gets a check in `tests/content-copies.test.js`.

## YouTube gotchas

- YouTube is a SPA on desktop and mobile: content scripts run once per tab, not once per page. On desktop, the `yt-navigate-finish` document event fires after each in-app navigation.
- YouTube renders lazily and re-renders its custom elements (`ytd-*` desktop, `ytm-*` mobile); elements may not exist at `document_idle` and may be replaced later. Prefer CSS rewrites; for DOM rewrites, use a `MutationObserver` and make every rewrite idempotent.
- m.youtube.com is a separate app with different markup (e.g. its logo is `ytm-home-logo > button[role=link]`, not a link). Its header disables pointer events for its children, it handles clicks anywhere inside some of its elements, and its router turns clicks on plain `<a>` elements inside the app into in-app navigation.
- www.youtube-nocookie.com serves only embedded players (`/embed/<id>`; its root is a 404), almost always inside iframes on other websites. www.youtube.com serves the same players at `/embed/<id>`.
- Scope each feature's CSS under its own `html[data-ourtube-<feature>]` attribute, set only while the feature is active, so turning it off reverts the CSS live.
- To change what a YouTube control does, hide it with CSS and insert a plain look-alike beside it (`src/content/logo-link.js` is the pattern); YouTube's element and its event handling stay untouched. Place the look-alike outside any YouTube element that handles clicks itself. On desktop a plain `<a>` gets a full page load; on mobile, YouTube's router navigates in-app.
- YouTube's CSS custom properties beyond `--yt-spec-*` have obfuscated names (`--t7f9…`) that change between releases; to match YouTube styling, reuse YouTube's classes or copy computed styles instead of naming those variables.
- Prefix every injected id, class, and attribute with `ourtube-` to avoid collisions with YouTube.

## Conventions

- Manifest V3 only. The extension CSP forbids inline `<script>` and `eval`; all JS lives in files.
- Minimum versions are Chrome 152 and Firefox 128 (`minimum_chrome_version`, `strict_min_version`). Chrome 152 completes `browser.*` namespace and promise support; Firefox 128 is the first release that both accepts the dual `background` declaration and grants content-script host permissions at install. Raise them only when a needed API requires it.
- `browser_specific_settings.gecko.id` is permanent once the extension is signed by Mozilla, and `storage.sync` depends on it; keep it unchanged.
- Leave all changes uncommitted in the working tree; the owner reviews and commits manually.
- Log with a `[OurTube]` prefix.
- Request the narrowest `permissions` / `host_permissions` that work; every addition triggers a new permission warning for users.

## Testing

Pure logic lives in `src/shared/` and is unit-tested in `tests/` with Node's built-in runner: `npm test` (no dependencies; `package.json` only marks `.js` files as ES modules and lists, under `webExt.ignoreFiles`, the development files web-ext leaves out of the extension package: add new ones there). Page behaviour is verified by hand in both browsers, logged in and logged out, on every site the feature touches. Content script logs appear in the YouTube tab's DevTools console in both.

- **Sites:** for m.youtube.com, use a phone preset in Chrome's device toolbar or Firefox's Responsive Design Mode (YouTube redirects phone user agents from www to m). For embedded players, open any page that embeds `https://www.youtube-nocookie.com/embed/<id>` in an iframe.

- **Lint:** `npx web-ext lint` (Mozilla's tool) validates the manifest and code against Firefox's rules. The one expected warning is `MANIFEST_FIELD_UNSUPPORTED` for `/background/service_worker`; anything else is a real problem.
- **Chrome:** load unpacked at `chrome://extensions` (Developer mode → Load unpacked → repo root); after changes, click the reload icon on the extension card and refresh the YouTube tab. Background logs via the "service worker" link on the card; popup logs by right-clicking the popup → Inspect. Logged-out testing: an Incognito window, after enabling "Allow in Incognito" on the extension's Details page.
- **Firefox:** `npx web-ext run` launches a fresh Firefox profile with the extension loaded and reloads it on file changes. That profile is logged out; use `--firefox-profile` to test logged in. Alternatively, `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → `manifest.json` (removed on browser restart). Background and popup logs via the extension's Inspect button on that page.

## Agent skills

### Issue tracker

GitHub Issues on `jzaia18/OurTube`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
