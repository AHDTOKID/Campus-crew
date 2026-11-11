import { ApiError } from '../utils/ApiError.js';

/**
 * Tenant middleware — derives req.collegeId STRICTLY from verified user state.
 * Never trusts client-supplied collegeId (SRS 6.2, FR-C01/C02).
 */
export function requireVerifiedCollege(req, _res, next) {
    if (!req.user) return next(ApiError.unauthorized());
    if (req.user.role === 'admin') {
        // Admins operate on explicit resource IDs; block college scoping for them here.
        return next(ApiError.forbidden('Administrative endpoints use /api/admin'));
    }
    if (req.user.status !== 'verified') return next(ApiError.forbidden('College affiliation not verified'));
    if (!req.user.collegeId) return next(ApiError.forbidden('No college associated with account'));
    req.collegeId = req.user.collegeId;
    next();
}