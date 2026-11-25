export type UserRole = 'ADMIN' | 'MANAGER' | 'DRIVER' | 'DISPATCHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}
