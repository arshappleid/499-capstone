module.exports = {
	// preset: 'react',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{js,jsx}'],
	transform: {
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	coverageDirectory: 'coverage',
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleDirectories: ['node_modules', 'src'],
	modulePaths: ['<rootdir>/src'],
};
