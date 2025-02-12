module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.test.ts',
        '!src/**/index.ts',
        '!src/setupTests.ts',
        '!src/**/mocks/**',
        '!src/error/**',
    ],
    coverageReporters: ['text', 'html', 'lcov'],
};