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
        Error.captureStackTrace(this, InvalidScheduleValue);
    }
}

export class InvalidScheduleUnit extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, InvalidScheduleUnit);
    }
}

export class InvalidUrl extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, InvalidUrl);
    }
}

export class InvalidServices extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, InvalidServices);
    }
}

export class InvalidEmail extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, InvalidEmail);
    }
}
