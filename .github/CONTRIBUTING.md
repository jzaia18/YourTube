# Contributing to YourTube

Thank you for taking the time to contribute to YourTube!

Every change upholds YourTube's [principles](../README.md#principles). `AGENTS.md` holds the full
development guide: where code lives, YouTube's quirks, and how to test.

## Pull requests

Open each pull request from a branch off `main`, and fill in the pull request template. Keep it to
one feature or fix, small enough to review in one sitting; split unrelated changes into separate
pull requests.

- **Changelog.** Add an entry to [`CHANGELOG.md`](CHANGELOG.md) under the category that fits in
  the development release at the top: one or two sentences describing the visible change, ending
  with a link back to the pull request, e.g. `[(#12)](https://github.com/jzaia18/YourTube/pull/12)`.
  Add your name to that release's contributors.
- **Version.** The "Pull request requirements" workflow sets the version in `manifest.json` on
  your branch whenever the pull request is opened or updated, so pull before pushing more commits.
  Pull requests from forks can't be updated automatically: set the version the failing check
  names by hand. The same check fails until the changelog links to the pull request.

## Versioning

Browsers only accept 1–4 dot-separated numbers in `version`. A development build keeps the last
release's number plus a fourth "dev" counter, and shows its pre-release label in `version_name`:

| Build                         | `version` | `version_name` |
| ----------------------------- | --------- | -------------- |
| Release 0.1.0                 | `0.1.0`   | (none)         |
| Dev build *N* toward 0.2.0    | `0.1.0.N` | `0.2.0-devN`   |
| Release 0.2.0                 | `0.2.0`   | (none)         |

Each pull request takes `main`'s dev counter plus one; after a release, the next pull request
starts `-dev1` of the following minor release. Only releases are published to browser stores.

## Releasing

Open a pull request that:

1. Sets `version` in `manifest.json` to the release number and removes `version_name`. The
   workflow treats a pull request with no `version_name` and a `version` above `main`'s as a
   release: it keeps that version and skips the changelog link check.
2. Renames the changelog's top heading to `# Release X.Y.Z` and deletes its empty categories.
3. Adds a new development release above it for the next minor version:

```markdown
# Release X.Y.Z-dev (development release)

### New features since last release

### Improvements 🛠

### Breaking changes 💔

### Deprecations 👋

### Internal changes ⚙️

### Documentation 📝

### Bug fixes 🐛

### Contributors ✍️

This release contains contributions from (in alphabetical order):

---
```
