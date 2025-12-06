export class AppError extends Error {
    status: number;
    code?: string;
    cause?: Error;

    constructor(
        message: string,
        status = 400,
        code?: string,
        cause?: Error
    ) {
        super(message);

        this.name = "AppError";
        this.status = status;
        this.code = code;

        if (cause) {
            this.cause = cause;
        }
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function parseError(error: unknown): string {
    if (error instanceof AppError) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred.";
}

export function handleAppError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof Error) {
        // ✅ Wrapped errors are SERVER errors → 500
        // ✅ Original error preserved via `cause`
        return new AppError(error.message, 500, undefined, error);
    }

    return new AppError("An unexpected error occurred.", 500);
}
