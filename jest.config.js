module.exports = {
    'preset': 'react-native',
    'moduleFileExtensions': ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    'setupFiles': ['./node_modules/react-native-gesture-handler/jestSetup.js'],
    'reporters': ['default', ['jest-sonar', {
        outputDirectory: 'reports',
        outputName: 'test-report.xml',
        reportedFilePath: 'absolute'
    }]]
};
