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

        it('should allow for multiple chaos functions to be mapped to the same class', async (done) => {
            expect(chaosFunctions['test'].length).toBe(2);
            expect(chaosFunctions['test2'].length).toBe(2);
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

        it('should map multiple disabled functions to the same class', async (done) => {
            expect(disabledChaosFunctions['test'].length).toBe(2);
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

    @disabled()
    testFunction2() {
        return false;
    }

    @chaosFunction()
    testFunction3() {
        return true || false;
    }

    @chaosFunction()
    testFunction4() {
        return 'true';
    }
}

class Test2 {
    constructor() {}

    @chaosFunction()
    testFunction() {
        return true;
    }

    @chaosFunction()
    testFunction2() {
        return false;
    }
}
