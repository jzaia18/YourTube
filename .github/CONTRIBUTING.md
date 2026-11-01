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
- **Version.** Set `version` and `version_name` in `manifest.json` to the next dev build after
  `main`'s (see [Versioning](#versioning)). If another pull request merges first, merge `main`
  into your branch and take the following number.
- **Checks.** All CI checks must pass before a pull request can merge.

## Versioning

Browsers only accept 1–4 dot-separated numbers in `version`. A development build adds a fourth
"dev" counter to the release it leads to, and shows its pre-release label in `version_name`:

| Build                         | `version` | `version_name` |
| ----------------------------- | --------- | -------------- |
| Release 0.1.0                 | `0.1.0`   | `0.1.0`        |
| Dev build *N* toward 0.2.0    | `0.2.0.N` | `0.2.0-devN`   |
| Release 0.2.0                 | `0.2.0`   | `0.2.0`        |

Each pull request takes `main`'s dev counter plus one; after a release, the next pull request
starts `-dev1` of the following minor release. Only releases are published to browser stores.
