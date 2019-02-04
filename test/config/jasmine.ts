const { SpecReporter } = require('jasmine-spec-reporter');
const { JUnitXmlReporter } = require('jasmine-reporters');

// Clear any existing reporters
jasmine.getEnv().clearReporters();

// Add SpecReporter
jasmine.getEnv().addReporter(
    new SpecReporter({
        spec: {
            displayPending: true,
            displayStacktrace: 'all',
        },
        summary: {
            displayDuration: true,
        },
    }),
);

// Add JUnitXmlReporter
jasmine.getEnv().addReporter(
    new JUnitXmlReporter({
        savePath: 'test/reports',
        consolidateAll: true,
    }),
);
