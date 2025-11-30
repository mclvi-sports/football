import { createClient } from "./client";

export type AuthError = {
  message: string;
  status?: number;
};

export type AuthResult<T = void> = {
  data: T | null;
  error: AuthError | null;
};

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Request a password reset email
 */
export async function resetPasswordForEmail(
  email: string,
  redirectTo?: string
): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Update user password (used after clicking reset link)
 */
export async function updatePassword(
  newPassword: string
): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  return { data: null, error: null };
}

/**
 * Get the current user session
 */
export async function getSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error };
  }

  return { session, error: null };
}

/**
 * Get the current user
 */
export async function getUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error };
  }

  return { user, error: null };
}
