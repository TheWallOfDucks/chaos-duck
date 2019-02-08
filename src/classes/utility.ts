import { SupportedServices } from '../config/supportedServices';
import { InvalidScheduleValue, InvalidScheduleUnit, InvalidUrl } from '../classes/errors';

/**
 * @description Basic utility functions
 */
export class Utility {
    /**
     * @description Converts all items in an array of strings to lowercase
     * @param {string[]} array
     * @returns {string[]}
     */
    static convertToLowercase(array: string[]) {
        return array.map((item) => item.toLowerCase());
    }

    /**
     * @description Returns a random number based on desired length
     * @param {number} length
     * @returns {string}
     */
    static generateRandomNumber(length: number): string {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)).toString();
    }

    /**
     * @description Returns the key in an object based on string value provided
     * @param {string} value
     * @returns {string}
     */
    static getServiceByValue(value: string) {
        return Object.keys(SupportedServices).find((key) => SupportedServices[key] === value);
    }

    /**
     * @description Returns a random item from an array
     * @param {any[]} array
     * @returns {any}
     */
    static getRandom(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * @description Validates a string is a valid cron expression
     * @param {string} cron
     * @returns {boolean}
     */
    static validateCron(cron: string) {
        const cronRegex = new RegExp(
            /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
        );
        return cronRegex.test(cron);
    }

    /**
     * @description Validates a string is a valid email address
     * @param {string} email
     * @returns {boolean}
     */
    static validateEmail(email: string) {
        const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return emailRegex.test(String(email).toLowerCase());
    }

    /**
     * @description Validates a string is a valid number
     * @param {string} string
     * @returns {boolean}
     */
    static validateNumber(string: string) {
        return /^\d+$/.test(string);
    }

    /**
     * @description Validates a string against AWS schedule syntax
     * @param {string} rate
     * @returns {boolean}
     */
    static validateSchedule(rate: string) {
        const supportedUnits = ['minute', 'minutes', 'hour', 'hours', 'day', 'days'];
        const parts = rate.split(' ');
        const value = Number(parts[0]);
        const unit = parts[1].toLowerCase();

        if (value <= 0) {
            throw new InvalidScheduleValue(`Invalid schedule value: "${value}". Value must be greater than 0.`);
        }

        if (!supportedUnits.includes(unit)) {
            throw new InvalidScheduleUnit(`Invalid schedule unit: "${unit}". Try one of these instead: ${supportedUnits}.`);
        }

        return true;
    }

    /**
     * @description Validates whether a given string is a url or not
     * @param {string} url
     * @returns {boolean}
     */
    static validateUrl(url: string) {
        const pattern = new RegExp(
            '^((ft|htt)ps?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?' + // port
            '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
            '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i',
        ); // fragment locator
        return pattern.test(url);
    }
}
