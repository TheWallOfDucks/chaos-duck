export const chaosFunctions = {};
import { disabledChaosFunctions } from './disabled';

/**
 * @description Marks a function as a chaos function that can be run
 */
export function chaosFunction() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const className = target['constructor'].name.toLowerCase();

        // Check if the class exists in the list of classes with disabled chaos functions
        if (disabledChaosFunctions[className]) {
            // Check if the chaos function is marked as disabled
            if (disabledChaosFunctions[className].indexOf(key) === -1) {
                // If the class doesn't exist in the list of chaos functions, add it and the chaos function
                if (!chaosFunctions[className]) {
                    chaosFunctions[className] = [key];
                } else {
                    // If it does exist in the list, just push the chaos function
                    chaosFunctions[className].push(key);
                }
            }
        } else if (!chaosFunctions[className]) {
            // If the class is not in the list of classes with disabled chaos functions
            // and it has not been added to the list of chaos functions, add it and the
            // chaos function
            chaosFunctions[className] = [key];
        } else {
            // If it does exist in the list, just push the chaos function
            chaosFunctions[className].push(key);
        }
    };
}
