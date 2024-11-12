module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.run.ts'],
  moduleNameMapper: {
    '^@offs/core$': '<rootDir>/packages/core/src/index.ts',
    '^@offs/vue$': '<rootDir>/packages/vue/src/index.ts'
  }
};
