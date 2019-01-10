export class Utility {
    static convertToLowercase(array: string[]) {
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].toLowerCase();
        }
        return array;
    }

    static getRandom(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
