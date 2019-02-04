import { chaosFunctions, chaosFunction } from '../../../src/decorators/chaosFunction';
import { disabled, disabledChaosFunctions } from '../../../src/decorators/disabled';

describe('decorators', () => {
    describe('@chaosFunction', () => {
        it('should create a map of available chaos functions', async (done) => {
            for (const service in chaosFunctions) {
                expect(chaosFunctions[service].length).toBeGreaterThan(0);
            }
            done();
        });
    });

    describe('@disabled', () => {
        it('should remove chaos function from map of available chaos functions', async (done) => {
            expect(disabledChaosFunctions['test']).toBeDefined();
            expect(disabledChaosFunctions['test'][0]).toBe('testFunction');
            expect(chaosFunctions['testFunction']).not.toBeDefined();
            done();
        });
    });
});

class Test {
    constructor() {}

    @chaosFunction()
    @disabled()
    testFunction() {
        return true;
    }
}
