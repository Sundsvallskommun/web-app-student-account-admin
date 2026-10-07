// babel
module.exports = {
  roots: ['<rootDir>/'],
  // "testTimeout": 15000,
  // Add more setup options before each test is run
  setupFiles: ['<rootDir>/.jest/setEnvVars'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.js'],
  collectCoverage: true,
  // on node 14.x coverage provider v8 offers good speed and more or less good report
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '<rootDir>/src/services/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/pages/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/components/**/*.{js,jsx,ts,tsx}',
    '!**/__unused__/**',
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Module aliases, kept in sync with tsconfig.json "paths"
    '@components/(.*)$': '<rootDir>/src/components/$1',
    '@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '@layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '@store/(.*)$': '<rootDir>/src/store/$1',
    '@utils/(.*)$': '<rootDir>/src/utils/$1',
    '@public/(.*)$': '<rootDir>/public/$1',
    '@services/(.*)$': '<rootDir>/src/services/$1',
    '@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '@jestRoot/(.*)$': '<rootDir>/.jest/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/.jest/fileTransformer.js',
  },
  transformIgnorePatterns: [
    // '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
};
