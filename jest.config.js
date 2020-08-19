module.exports = {
  globalSetup: "<rootDir>/jest.setup.js",
  globalTeardown: "<rootDir>/jest.teardown.js",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^~/(.*)$": "<rootDir>/src/$1",
    "^vue$": "vue/dist/vue.common.js"
  },
  moduleFileExtensions: ["js", "vue", "json"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/store/**/*.(vue|js)"],
  forceExit: !!process.env.CI // almost every CI platform sets this by default
};
