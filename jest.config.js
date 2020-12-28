module.exports = {
  setupFilesAfterEnv: ['./lib/models/index.js', './jest.setup.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['./node_modules', './dist'],
  modulePathIgnorePatterns: ['./docker'],
};
