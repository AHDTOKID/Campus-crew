export class ApiError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
    static badRequest(m = 'Bad request', d) { return new ApiError(400, m, d); }
    static unauthorized(m = 'Authentication required') { return new ApiError(401, m); }
    static forbidden(m = 'Forbidden') { return new ApiError(403, m); }
    static notFound(m = 'Not found') { return new ApiError(404, m); }
    static conflict(m = 'Conflict') { return new ApiError(409, m); }
    static tenant(m = 'Not available in your college') { return new ApiError(403, m); }
}