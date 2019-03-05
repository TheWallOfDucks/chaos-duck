export const disabledChaosFunctions = {};

/**
 * @description Marks a chaos function as disabled
 */
export function disabled() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const className = target['constructor'].name.toLowerCase();

        if (!disabledChaosFunctions[className]) {
            disabledChaosFunctions[className] = [key];
        } else {
            disabledChaosFunctions[className].push(key);
        }
    };
}
