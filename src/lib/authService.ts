// Integration point for the project's existing authentication.
// Replace the body of signIn() with a call to your real provider/API
// (and its session handling). It must resolve on success and throw an
// AuthError on failure. It never simulates a successful login.

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
  // TODO: connect to the existing auth backend, e.g.
  // const res = await fetch('/api/auth/login', { method: 'POST', credentials: 'include', ... });
  // if (res.status === 401) throw new AuthError('Incorrect email or password.');
  // if (!res.ok) throw new AuthError('Unable to sign in. Please try again.');
  throw new AuthError('Sign-in is not connected to a backend yet.');
}
