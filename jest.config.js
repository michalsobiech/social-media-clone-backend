/** @type {import('jest').Config} */
export default {
  transform: {},
  globalSetup: "./tests/globalSetup.js",
  globalTeardown: "./tests/globalTeardown.js",
  setupFilesAfterEnv: ["./tests/setup.js"],
};
