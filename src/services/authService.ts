export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface SignInInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export async function signIn(_input: SignInInput): Promise<void> {
  // Integration point for authentication backend.
  // Replace the body with your real API call:
  // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(_input) });
  // if (!res.ok) throw new AuthError('Invalid credentials');
  throw new AuthError('Sign-in is not connected to a backend yet.');
}
