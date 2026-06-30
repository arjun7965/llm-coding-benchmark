import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import { loadTasks } from "../src/harness.mjs";
import { targetProfileIds } from "../src/target-profiles.mjs";

const capabilityIds = [
  "bare-metal",
  "peripheral-drivers",
  "interrupt-concurrency",
  "rtos",
  "embedded-linux",
  "constrained-memory",
  "protocols",
  "reliability",
  "boot-update",
  "power-real-time",
  "debugging",
  "language-safety",
  "firmware-security",
  "resource-optimization",
];

test("embedded capability matrix covers every planned capability", () => {
  const matrix = readFileSync(
    new URL("../docs/embedded/capability-matrix.md", import.meta.url),
    "utf8",
  );

  for (const capability of capabilityIds) {
    assert.ok(
      matrix.includes(`| \`${capability}\` |`),
      `missing embedded capability: ${capability}`,
    );
  }
});

test("embedded task rubrics reference defined target profiles", () => {
  const tasks = loadTasks(new URL("../tasks.json", import.meta.url));
  const assumptions = readFileSync(
    new URL("../docs/embedded/target-assumptions.md", import.meta.url),
    "utf8",
  );

  for (const profile of targetProfileIds) {
    assert.ok(
      assumptions.includes(`### \`${profile}\``),
      `undocumented target profile: ${profile}`,
    );
  }
  for (const task of tasks.filter((item) => item.targetProfile)) {
    const rubric = readFileSync(
      new URL(`../docs/benchmarks/${task.id}.md`, import.meta.url),
      "utf8",
    );
    assert.ok(
      rubric.includes(`Target profile: \`${task.targetProfile}\``),
      `${task.id} does not reference ${task.targetProfile}`,
    );
    assert.ok(
      assumptions.includes(
        `| \`${task.id}\` | \`${task.targetProfile}\` |`,
      ),
      `${task.id} is missing from the target profile mapping table`,
    );
  }
});
