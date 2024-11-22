module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    moduleNameMapper: {
      '@/(.*)': '<rootDir>/$1',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    },
  };
  