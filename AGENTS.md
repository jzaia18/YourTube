# OurTube

Browser extension (Manifest V3, Chrome and Firefox) that rewrites the YouTube UI. Plain JS/CSS loaded directly by the browser: no build step, no bundler, no dependencies. Keep it that way unless the owner asks otherwise.

## Principles

Every change upholds all of these; a feature request that conflicts with one goes back to the owner before any code is written. `README.md` carries a short user-facing summary of these principles; update it whenever this list changes.

1. **Every behaviour is configurable.** Each feature ships with its own setting to disable it, added in the same change as the feature. Settings are clear and intuitive: labelled by the visible effect on YouTube in plain language, not by implementation names. The default (on or off) varies per feature: ask the owner when creating each one. Toggling a setting takes effect immediately in every open YouTube tab, with no reload.
2. **Unimposing.** Changes to the page are minimal and blend into YouTube's design; at a glance the altered page is still obviously YouTube. Build added UI from YouTube's own look: its `--yt-spec-*` CSS variables (which also track light/dark theme), fonts, spacing, and existing element patterns, rather than a separate OurTube style.
3. **Works logged in and logged out.** Every feature works for both. YouTube serves different markup and content to each (e.g. sign-in prompts, no subscriptions or history, a sparse home feed when logged out), so verify features in both states.
4. **Aesthetic only.** The extension changes only how the page renders on the user's screen; everything YouTube's backend receives is exactly what it would without the extension. Leave YouTube's own JS, network traffic, and user actions untouched: no intercepting or modifying requests, no requests made on the user's behalf, no synthetic clicks or other interactions with YouTube controls. Prefer hiding elements with CSS over removing them from the DOM, so YouTube's scripts keep seeing the page they built.
5. **Chrome and Firefox.** Every feature works in both browsers from one codebase. Use only WebExtension APIs and manifest keys both support and verify features in both. Call extension APIs through the promise-based `browser.*` namespace, native to Firefox and available in Chrome 148+.

## Execution contexts

Each directory under `src/` runs in a different extension context with different powers; put code where its context can run it.

- `src/content/` — injected into `https://www.youtube.com/*` tabs. Shares the page's DOM but runs in an isolated JS world (YouTube's own JS globals are invisible). Loaded as a classic script, so `import` is unavailable: keep each content script self-contained in an IIFE. Only a subset of `browser.*` APIs works here (`storage`, `runtime`).
- `src/background/` — one ES module that runs as a service worker in Chrome and as an event page in Firefox (`manifest.json` declares it under both `service_worker` and `scripts`; each browser ignores the other key). Write it to the service-worker subset: no DOM access, and the browser unloads it when idle, so state lives in `browser.storage`, never in module variables. Register listeners synchronously at top level.
- `src/popup/` — toolbar popup page (ES module). Recreated every time it opens.
- `src/shared/` — ES modules importable by background and popup only.

Settings flow through `browser.storage.sync`: defaults in `src/shared/settings.js` (mirrored by hand in `content.js`), the popup writes, content scripts react via `browser.storage.onChanged`.

## YouTube gotchas

- YouTube is a SPA: content scripts run once per tab, not once per page. Re-apply rewrites on the `yt-navigate-finish` document event.
- YouTube renders lazily and re-renders its custom elements (`ytd-*`); elements may not exist at `document_idle` and may be replaced later. Prefer CSS rewrites; for DOM rewrites, use a `MutationObserver` and make every rewrite idempotent.
- Scope CSS rewrites under `html[data-ourtube]` so disabling the extension reverts them live.
- Prefix every injected id, class, and attribute with `ourtube-` to avoid collisions with YouTube.

## Conventions

- Manifest V3 only. The extension CSP forbids inline `<script>` and `eval`; all JS lives in files.
- Minimum versions are Chrome 152 and Firefox 128 (`minimum_chrome_version`, `strict_min_version`). Chrome 152 completes `browser.*` namespace and promise support; Firefox 128 is the first release that both accepts the dual `background` declaration and grants content-script host permissions at install. Raise them only when a needed API requires it.
- `browser_specific_settings.gecko.id` is permanent once the extension is signed by Mozilla, and `storage.sync` depends on it; keep it unchanged.
- Leave all changes uncommitted in the working tree; the owner reviews and commits manually.
- Log with a `[OurTube]` prefix.
- Request the narrowest `permissions` / `host_permissions` that work; every addition triggers a new permission warning for users.

## Testing

No automated tests yet. Verify every change by hand in both browsers. Content script logs appear in the YouTube tab's DevTools console in both.

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
