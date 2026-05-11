/**
 * This file previously contained mock auth. The app now uses Google OAuth
 * via the backend. These exports are kept as no-ops so existing imports
 * don't break — LoginModal and CreateAccountModal have been updated to
 * use the real auth flow.
 */
export interface User {
  full_name: string;
  email: string;
  role: string;
  company_name?: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}
// No-op — not used after real auth wiring
export const mockLogin = (_e: string, _p: string): Promise<AuthResponse> =>
  Promise.reject(new Error('Use Google OAuth'));
export const mockRegister = (_d: any): Promise<AuthResponse> =>
  Promise.reject(new Error('Use Google OAuth'));
