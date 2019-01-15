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

    static validateRate(rate: string) {
        const parts = rate.split(' ');
        const value = parts[0];
        const unit = parts[1];

        console.log('value => ', value);
        console.log('unit => ', unit);
    }
}
