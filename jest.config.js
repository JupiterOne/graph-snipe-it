module.exports = {
  clearMocks: true,
  setupFiles: ['./testSetup.ts'],
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*test.(js|ts)'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
