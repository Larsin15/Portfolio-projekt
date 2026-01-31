import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db, sessions, users } from "@portfolio/db";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Session, User } from "lucia";

// Create the adapter
const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

// Initialize Lucia
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // Cookie expires when browser closes in development
    expires: false,
    attributes: {
      // Set to true in production (HTTPS)
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      emailVerified: attributes.emailVerified,
    };
  },
});

// Extend Lucia types
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      emailVerified: boolean;
    };
  }
}

/**
 * Validate the current session from cookies.
 * Cached per-request to avoid redundant DB calls.
 */
export const validateRequest = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return { user: null, session: null };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch {
      // Next.js throws when cookies are set after headers are sent
      // This is expected in some cases
    }

    return result;
  }
);

/**
 * Get the current user or null.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { user } = await validateRequest();
  return user;
}

/**
 * Require authentication, redirect to login if not authenticated.
 */
export async function requireAuth(): Promise<{ user: User; session: Session }> {
  const result = await validateRequest();
  if (!result.user) {
    throw new Error("Unauthorized");
  }
  return result as { user: User; session: Session };
}

