const { SpecReporter } = require('jasmine-spec-reporter');
const { JUnitXmlReporter } = require('jasmine-reporters');

jasmine.getEnv().clearReporters();

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

jasmine.getEnv().addReporter(
    new JUnitXmlReporter({
        savePath: 'docs/reports',
        consolidateAll: false,
    }),
);
