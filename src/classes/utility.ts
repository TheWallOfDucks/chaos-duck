export class Utility {
    static convertToLowercase(array: string[]) {
        return array.map((item) => item.toLowerCase());
    }

    static getRandom(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
