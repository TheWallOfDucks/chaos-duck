import { Utility } from '../../../src/classes/utility';
import * as faker from 'faker';

describe('utility', () => {
    describe('convertToLowercase', () => {
        it('should convert all provided values to lower case', (done) => {
            const values = Utility.convertToLowercase([faker.random.word(), faker.random.word(), faker.random.word()]);

            values.forEach((value) => {
                expect(isLowerCase(value)).toBeTruthy(`Expected ${value} to be lower case`);
            });

            function isLowerCase(str: string) {
                return str === str.toLowerCase();
            }

            done();
        });
    });

    describe('generateRandomNumber', () => {
        it('should return a number of the desired length', (done) => {
            const length = faker.random.number(50);
            const number = Utility.generateRandomNumber(length);
            expect(number.length).toBe(length);
            done();
        });
    });

    describe('getServiceByValue', () => {
        it('should return formatted service name by value', (done) => {
            const service = Utility.getServiceByValue('ecs');
            expect(service).toBe('ECS');
            done();
        });
    });

    describe('getRandom', () => {
        it('should return a random item from provided values', (done) => {
            const values = [faker.random.word(), faker.random.word(), faker.random.word()];
            const value = Utility.getRandom(values);
            expect(values.includes(value)).toBeTruthy();
            done();
        });
    });

    describe('validateCron', () => {
        it('should return true for valid cron syntax', (done) => {
            const cron = '0 * * * *';
            expect(Utility.validateCron(cron)).toBeTruthy();
            done();
        });

        it('should return false for invalid cron syntax', (done) => {
            const cron = 'hourly';
            expect(Utility.validateCron(cron)).not.toBeTruthy();
            done();
        });
    });

    describe('validateEmail', () => {
        it('should return true for valid email addresses', (done) => {
            const email = faker.internet.email();
            expect(Utility.validateEmail(email)).toBeTruthy();
            done();
        });

        it('should return false for invalid email addresses', (done) => {
            const email = 'chaos-duck@example';
            expect(Utility.validateEmail(email)).not.toBeTruthy();
            done();
        });
    });

    describe('validateNumber', () => {
        it('should return true for valid number strings', (done) => {
            const number = '1234';
            expect(Utility.validateNumber(number)).toBeTruthy();
            done();
        });

        it('should return false for invalid number strings', (done) => {
            const number = 'one';
            expect(Utility.validateNumber(number)).not.toBeTruthy();
            done();
        });
    });

    describe('validateSchedule', () => {
        it('should return true for valid AWS schedule syntax', (done) => {
            const schedule = '1 hour';
            expect(Utility.validateSchedule(schedule)).toBeTruthy();
            done();
        });

        it('should return InvalidScheduleValue error if a value less than or equal to 0 is provided', (done) => {
            try {
                const schedule = '0 hours';
                Utility.validateSchedule(schedule);
            } catch (error) {
                expect(error.message).toBe('Invalid schedule value: "0". Value must be greater than 0.');
            }

            done();
        });

        it('should return InvalidScheduleUnit error if an unsupported unit is provided', (done) => {
            try {
                const schedule = '2 years';
                Utility.validateSchedule(schedule);
            } catch (error) {
                expect(error.message).toBe('Invalid schedule unit: "years". Try one of these instead: minute,minutes,hour,hours,day,days.');
            }

            done();
        });
    });

    describe('validateUrl', () => {
        it('should return true for a valid URL', (done) => {
            const url = 'https://www.google.com';
            expect(Utility.validateUrl(url)).toBeTruthy();
            done();
        });

        it('should return false for an invalid URL', (done) => {
            const url = 'url';
            expect(Utility.validateUrl(url)).not.toBeTruthy();
            done();
        });
    });
});
