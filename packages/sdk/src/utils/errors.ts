export class NotYetImplementedError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = 'NotYetImplementedError';
    }
}

export class ClientError extends Error {
    constructor(
        public statusCode: number,
        public errorCode: string | number | null,
        public message: string,
        public header?: any,
        public errorData?: any,
    ) {
        super(message);
        this.name = 'ClientError';
    }
}

export class ServerError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
    ) {
        super(message);
        this.name = 'ServerError';
    }
}

export class SerializationError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = 'SerializationError';
    }
}
