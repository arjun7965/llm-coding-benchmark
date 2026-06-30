import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import { loadTasks } from "../src/harness.mjs";

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

const currentTaskProfiles = new Map([
  ["embedded-ring-buffer", "c11-lock-free-spsc"],
  ["firmware-state-machine", "c11-mocked-hal"],
  ["binary-parser", "portable-c11"],
]);

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
  const taskIds = new Set(tasks.map((task) => task.id));
  const profileRequired = tasks
    .filter((task) => ["embedded", "firmware"].includes(task.category))
    .map((task) => task.id);
  const assumptions = readFileSync(
    new URL("../docs/embedded/target-assumptions.md", import.meta.url),
    "utf8",
  );

  for (const taskId of profileRequired) {
    assert.equal(
      currentTaskProfiles.has(taskId),
      true,
      `missing target profile mapping for ${taskId}`,
    );
  }
  for (const [taskId, profile] of currentTaskProfiles) {
    assert.equal(taskIds.has(taskId), true, `unknown embedded task: ${taskId}`);
    assert.ok(
      assumptions.includes(`### \`${profile}\``),
      `undefined target profile: ${profile}`,
    );
    const rubric = readFileSync(
      new URL(`../docs/benchmarks/${taskId}.md`, import.meta.url),
      "utf8",
    );
    assert.ok(
      rubric.includes(`Target profile: \`${profile}\``),
      `${taskId} does not reference ${profile}`,
    );
  }
});
