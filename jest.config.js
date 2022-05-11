module.exports = {
  preset: "ts-jest",
  roots: ["src"],
  moduleDirectories: ["node_modules", "src"],
  setupFilesAfterEnv: ["./setupJest.ts"],
  testEnvironment: "jsdom",
};
