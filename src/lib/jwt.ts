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

export type Role = "ProductManager" | "User";

export const getRoleFromToken = (token: string): Role | null => {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    for (const key of ROLE_CLAIM_KEYS) {
        const value = payload[key];
        const role = Array.isArray(value) ? value[0] : value;
        if (role === "ProductManager" || role === "User") return role;
    }
    return null;
};
