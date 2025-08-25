export class HttpError extends Error {
  constructor(message, status = 500, details) {
    super(message);
    this.status = status;
    if (details) this.details = details;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', details) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', details) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', details) {
    super(message, 403, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found', details) {
    super(message, 404, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', details) {
    super(message, 409, details);
  }
}
