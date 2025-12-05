export class AppError extends Error {
    status?: number;
    code?: string;

    constructor(message: string, status = 400, code?: string) {
        super(message);
        this.status = status;
        this.code = code;
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
        return new AppError(error.message);
    }

    return new AppError("An unexpected error occurred.");
}