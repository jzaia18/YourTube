import { test } from "node:test";
import assert from "node:assert/strict";
import { isRelease, nextDevVersion } from "../.github/scripts/dev-version.js";

test("a manifest from before version_name counts as dev0 of its version", () => {
  assert.deepEqual(nextDevVersion({ version: "0.1.0" }), {
    version: "0.1.0.1",
    version_name: "0.1.0-dev1",
  });
});

test("during a dev cycle, each pull request adds one to main's dev counter", () => {
  assert.deepEqual(nextDevVersion({ version: "0.1.0.4", version_name: "0.1.0-dev4" }), {
    version: "0.1.0.5",
    version_name: "0.1.0-dev5",
  });
});

test("after a release, the first pull request starts the next minor's dev cycle", () => {
  assert.deepEqual(nextDevVersion({ version: "0.1.0", version_name: "0.1.0" }), {
    version: "0.2.0.1",
    version_name: "0.2.0-dev1",
  });
});

test("a malformed version_name on main is an error", () => {
  assert.throws(() => nextDevVersion({ version: "0.1.0.1", version_name: "0.1.0-beta" }));
});

test("a pull request that sets both fields to a new X.Y.Z is a release", () => {
  const main = { version: "0.1.0.7", version_name: "0.1.0-dev7" };
  assert.ok(isRelease(main, { version: "0.1.0", version_name: "0.1.0" }));
  assert.ok(!isRelease(main, { version: "0.1.0.7", version_name: "0.1.0-dev7" }));
  assert.ok(!isRelease(main, { version: "0.1.0.7", version_name: "0.1.0" }));
  assert.ok(!isRelease(main, { version: "0.1.0" }));
});

test("a pull request that keeps main's release version is not a release", () => {
  const main = { version: "0.1.0", version_name: "0.1.0" };
  assert.ok(!isRelease(main, { version: "0.1.0", version_name: "0.1.0" }));
});
