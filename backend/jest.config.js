// jest.config.js
export default {
  setupFilesAfterEnv: ["./src/tests/setup.js"],
  testEnvironment: "node",
  transform: {}, // not using Babel or TypeScript for now
  transformIgnorePatterns: [], // ensure ESM modules aren’t ignored
};
