export function chaosFunction() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        if (!target['chaos']) {
            Object.defineProperty(target, 'chaos', { value: [key] });
        } else {
            target['chaos'].push(key);
        }
        return descriptor;
    };
}
