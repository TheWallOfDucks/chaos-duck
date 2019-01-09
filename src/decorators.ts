export const chaosFunctions = {};

export function chaosFunction() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const className = target['constructor'].name.toLowerCase();

        if (!chaosFunctions[className]) {
            chaosFunctions[className] = [key];
        } else {
            chaosFunctions[className].push(key);
        }
    };
}
