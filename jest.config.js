module.exports = {
  verbose: true,                     // Tampilkan log test secara rinci
  collectCoverage: true,            // Aktifkan laporan coverage
  coverageDirectory: 'coverage',    // Output folder untuk hasil coverage
  testMatch: ['**/tests/**/*.spec.js'], // Lokasi file test
  transform: {},                     // Jika tidak pakai Babel atau TS
  testEnvironment: 'allure-jest/node'
};
