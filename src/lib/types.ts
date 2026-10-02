export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  initials: string;
  provider: 'email' | 'google';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
