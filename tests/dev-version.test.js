import { test } from "node:test";
import assert from "node:assert/strict";
import { isRelease, nextDevVersion, writeVersion } from "../.github/scripts/dev-version.js";

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

test("writeVersion adds version_name after version, keeping the rest of the text", () => {
  const before = '{\n  "name": "YourTube",\n  "version": "0.1.0",\n  "x": [1, 2]\n}\n';
  assert.equal(
    writeVersion(before, { version: "0.1.0.1", version_name: "0.1.0-dev1" }),
    '{\n  "name": "YourTube",\n  "version": "0.1.0.1",\n  "version_name": "0.1.0-dev1",\n  "x": [1, 2]\n}\n',
  );
});

test("writeVersion replaces an existing version_name", () => {
  const before = '{\n  "version": "0.1.0.1",\n  "version_name": "0.1.0-dev1",\n  "x": 1\n}\n';
  assert.equal(
    writeVersion(before, { version: "0.1.0.2", version_name: "0.1.0-dev2" }),
    '{\n  "version": "0.1.0.2",\n  "version_name": "0.1.0-dev2",\n  "x": 1\n}\n',
  );
});
