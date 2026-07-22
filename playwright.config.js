// Minimal config — file:// pages, chromium only, no server needed.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  use: { browserName: "chromium" },
  reporter: "list",
});
