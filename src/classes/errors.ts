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

export class InvalidScheduleValue extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ChaosFunctionNotFound);
    }
}

export class InvalidScheduleUnit extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ChaosFunctionNotFound);
    }
}

export class InvalidUrl extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ChaosFunctionNotFound);
    }
}

export class InvalidServices extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ChaosFunctionNotFound);
    }
}
