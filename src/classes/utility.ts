const colors = require('colors');

/**
 * @description Basic utility functions
 */
export class Utility {
    static convertToLowercase(array: string[]) {
        return array.map((item) => item.toLowerCase());
    }

    static getRandom(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static validateCron(cron: string) {
        const cronRegex = new RegExp(
            /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
        );
        return cronRegex.test(cron);
    }

    static validateNumber(string: string) {
        return /^\d+$/.test(string);
    }

    static validateSchedule(rate: string) {
        const supportedUnits = ['minute', 'minutes', 'hour', 'hours', 'day', 'days'];
        const parts = rate.split(' ');
        const value = Number(parts[0]);
        const unit = parts[1];

        if (value <= 0) {
            throw new Error(`Invalid schedule value: "${value}". Value must be greater than 0.`);
        }

        if (!supportedUnits.includes(unit)) {
            throw new Error(`Invalid schedule unit: "${unit}". Try one of these instead: ${supportedUnits}.`);
        }

        return true;
    }
}
