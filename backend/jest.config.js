const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    // 151002: ts-jest warns about the hybrid (nodenext) module kind without isolatedModules.
    // Files are CommonJS here (no "type": "module"), so the per-file transform is unambiguous.
    '^.+\\.ts$': ['ts-jest', { diagnostics: { ignoreCodes: [151002] } }],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
