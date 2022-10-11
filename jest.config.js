module.exports = {
  // this will become default in jest 27:
  testRunner: "jest-circus/runner",
  testMatch: ["**/*.test.js"],
  setupFiles: ["dotenv/config"],
  verbose: true,
  rootDir: "test",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
