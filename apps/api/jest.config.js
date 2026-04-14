const sharedTransform = {
  "^.+\\.ts$": [
    "ts-jest",
    {
      tsconfig: "<rootDir>/tsconfig.json"
    }
  ]
};

module.exports = {
  projects: [
    {
      displayName: "unit",
      moduleFileExtensions: ["js", "json", "ts"],
      moduleNameMapper: {
        "^@expressa/shared-types$": "<rootDir>/../../packages/shared-types/src/index.ts"
      },
      rootDir: ".",
      testEnvironment: "node",
      testMatch: ["<rootDir>/test/unit/**/*.spec.ts"],
      transform: sharedTransform
    },
    {
      displayName: "smoke",
      moduleFileExtensions: ["js", "json", "ts"],
      moduleNameMapper: {
        "^@expressa/shared-types$": "<rootDir>/../../packages/shared-types/src/index.ts"
      },
      rootDir: ".",
      testEnvironment: "node",
      testMatch: ["<rootDir>/test/smoke/**/*.spec.ts"],
      transform: sharedTransform
    }
  ]
};
