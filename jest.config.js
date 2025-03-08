module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Look for test files in the backend/tests directory
  roots: ["<rootDir>/backend/tests"],

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/*.test.mjs"],

  // Set up module file extensions for importing
  moduleFileExtensions: ["js", "mjs", "json", "node"],

  // Transform files with babel-jest for ES modules support
  transform: {
    "^.+\\.mjs$": "babel-jest"
  },

  // Use the Node environment for testing
  testEnvironment: "node",

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Jest doesn't handle ES modules natively in its configuration
  // This transforms imports in the test files
  transformIgnorePatterns: []
};

