import axios from "axios";

// Used for idempotent requests (PUT/DELETE, or POST guarded by an idempotency key) where
// a dropped connection (no `error.response` - the request never got a reply, not a 4xx/5xx)
// is safe to retry, e.g. a known RN-Android bug where a response intermittently surfaces as
// ERR_NETWORK/ERR_FAILED even though the server applied the request.
export const retryOnNetworkError = async <T>(fn: () => Promise<T>, attempts = 3): Promise<T> => {
    for (let attempt = 1; ; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const isNetworkError = axios.isAxiosError(err) && !err.response;
            if (!isNetworkError || attempt >= attempts) throw err;
            await new Promise((resolve) => setTimeout(resolve, attempt * 500));
        }
    }
};
