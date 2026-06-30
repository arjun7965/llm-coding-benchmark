export const targetProfileIds = Object.freeze([
  "portable-c11",
  "c11-lock-free-spsc",
  "c11-mocked-hal",
  "armv7m-bare-metal",
  "rv32-bare-metal",
  "generic-rtos",
  "embedded-linux-posix",
]);

export const targetProfileSet = new Set(targetProfileIds);

export const targetProfileRequiredCategories = new Set([
  "embedded",
  "firmware",
]);
