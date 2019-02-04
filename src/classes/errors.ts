export class ServiceNotFound extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ServiceNotFound);
    }
}

export class ChaosFunctionNotFound extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ChaosFunctionNotFound);
    }
}
