### Before submitting

Please complete the following checklist when submitting a PR:

- [ ] The PR covers one feature or fix, small enough to review in one sitting.

- [ ] Every new behaviour has a setting to turn it off, and new features are listed in the
      [`README.md`](https://github.com/jzaia18/YourTube/blob/main/README.md) Features section.

- [ ] Pure logic is unit-tested in the [`tests`](https://github.com/jzaia18/YourTube/tree/main/tests) directory, and `npm test` passes.

- [ ] `npx web-ext lint` reports nothing beyond the expected `/background/service_worker` warning.

- [ ] Page behaviour is checked by hand in Chrome and Firefox, logged in and logged out, on every
      YouTube site the change touches.

- [ ] An entry exists in the `.github/CHANGELOG.md` file, summarizing the change, and including a
      link back to the PR.

- [ ] The version in `manifest.json` is the next dev build after `main`'s.

When all the above are checked, delete everything above the dashed line and fill in the pull
request template.

------------------------------------------------------------------------------------------------------------

**Context:**

**Description of the Change:**

**Benefits:**

**Possible Drawbacks:**

**Related GitHub Issues:**
