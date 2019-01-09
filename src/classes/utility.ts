export class Utility {
    static getRandom(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
