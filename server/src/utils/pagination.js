export const MAX_PAGE_SIZE = 50;

export function pagination(req, { defaultLimit = 20 } = {}) {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit || defaultLimit)));
    const skip = (page - 1) * limit;
    return {
        page, limit, skip,
        meta: (total) => ({
            page, limit, total,
            pages: Math.ceil(total / limit) || 1,
        }),
    };
}