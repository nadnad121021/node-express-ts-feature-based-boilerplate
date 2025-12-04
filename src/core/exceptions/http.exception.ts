// src/core/exceptions/http.exception.ts

export class HttpException extends Error {
  public status: number;
  public message: string;
  public details?: unknown;
  public isOperational: boolean;

  constructor(status = 500, message = 'Internal server error', details?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
    this.details = details;
    this.isOperational = true; // distinguish from unknown/unhandled errors

    // Capture stack trace (V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      // include details only when present (avoid leaking sensitive info)
      ...(this.details !== undefined ? { details: this.details } : {})
    };
  }
}

// Convenience helpers
export class BadRequestException extends HttpException {
  constructor(message = 'Bad request', details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(401, message, details);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden', details?: unknown) {
    super(403, message, details);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Not found', details?: unknown) {
    super(404, message, details);
  }
}
