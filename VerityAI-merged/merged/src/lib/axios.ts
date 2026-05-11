import axios from 'axios';

const api = axios.create({
  baseURL: '/api/trpc',
  withCredentials: true, // backend uses httpOnly session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — on 401, clear auth state and redirect to home
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Lazy import to avoid circular deps
      import('../store/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout();
      });
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ─── tRPC helper ────────────────────────────────────────────────────────────
// The backend runs tRPC over /api/trpc. Each procedure is called as:
//   GET  /api/trpc/<router>.<procedure>?input=<JSON>   (queries)
//   POST /api/trpc/<router>.<procedure>                 (mutations, body = {0:{json:input}})

export async function trpcQuery<T = any>(
  procedure: string,
  input?: unknown
): Promise<T> {
  const params = input !== undefined
    ? `?input=${encodeURIComponent(JSON.stringify({ json: input }))}`
    : '';
  const res = await api.get<{ result: { data: { json: T } } }>(
    `/${procedure}${params}`
  );
  return res.data.result.data.json;
}

export async function trpcMutation<T = any>(
  procedure: string,
  input?: unknown
): Promise<T> {
  const body = input !== undefined ? { '0': { json: input } } : {};
  const res = await api.post<{ result: { data: { json: T } } }>(
    `/${procedure}`,
    body
  );
  return res.data.result.data.json;
}

export default api;
