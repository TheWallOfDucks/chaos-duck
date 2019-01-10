export const chaosFunctions = {};
import { disabledChaosFunctions } from './disabled';

/**
 * @description Marks a function as a chaos function that can be run
 */
export function chaosFunction() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const className = target['constructor'].name.toLowerCase();

        if (disabledChaosFunctions[className]) {
            if (disabledChaosFunctions[className].includes(key)) {
                return;
            }
        } else if (!chaosFunctions[className]) {
            chaosFunctions[className] = [key];
        } else {
            chaosFunctions[className].push(key);
        }
    };
}
