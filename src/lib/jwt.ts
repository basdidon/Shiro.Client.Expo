// Base64url decode is not available as a built-in in RN/Hermes, so decode by hand.
const base64UrlDecode = (segment: string): string => {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return atob(padded);
};

export const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;
    try {
        return JSON.parse(base64UrlDecode(payloadSegment));
    } catch {
        return null;
    }
};

// The backend hasn't documented which claim carries the role yet, so check the
// common ASP.NET Core Identity shapes until confirmed against a real token.
const ROLE_CLAIM_KEYS = [
    "role",
    "roles",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
];

// Same situation for the username claim — check the common shapes.
const USERNAME_CLAIM_KEYS = [
    "username",
    "unique_name",
    "name",
    "preferred_username",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
];

export type Role =
    | "super-admin"
    | "owner"
    | "order-manager"
    | "product-manager"
    | "staff"
    | "user";

const VALID_ROLES: Role[] = [
    "super-admin",
    "owner",
    "order-manager",
    "product-manager",
    "staff",
    "user",
];

// A user can hold more than one role at once (e.g. OrderManager + Staff), and the
// role claim may show up as a single string or an array under any of the claim keys.
export const getRolesFromToken = (token: string): Role[] => {
    const payload = decodeJwtPayload(token);
    if (!payload) return [];

    const roles = new Set<Role>();
    for (const key of ROLE_CLAIM_KEYS) {
        const value = payload[key];
        const values = Array.isArray(value) ? value : [value];
        for (const role of values) {
            if (VALID_ROLES.includes(role as Role)) roles.add(role as Role);
        }
    }
    return [...roles];
};

export const getUsernameFromToken = (token: string): string | null => {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    for (const key of USERNAME_CLAIM_KEYS) {
        const value = payload[key];
        if (typeof value === "string") return value;
    }
    return null;
};
