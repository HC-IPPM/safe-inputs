import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Session } from './auth_utils.ts';
import { get_session, email_sign_in, sign_out } from './auth_utils.ts';

// Partially based on https://github.com/nextauthjs/next-auth/blob/5d532cce99ee77447454a1eb9578e61d80e451fd/packages/next-auth/src/react.tsx
// Adapted to work in our non-Next.js SPA, simplified to only care about our uses cases (email auth only, different redirect and syncing behaviour, etc)

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';
export type SessionContextValue = {
  session: Session | null;
  status: SessionStatus;
  authBaseURL: string;
  sync: () => Promise<Session | null>;
  signIn: (email: string, callback_url: string) => Promise<Session | null>;
  signOut: () => Promise<null>;
};

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export const SessionProvider = ({
  children,
  authBaseURL,
}: PropsWithChildren<{ authBaseURL: string }>) => {
  const [isInitialSync, setIsInitialSync] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isInitialSync) {
      let cancel_sync = false;

      const sync_session = async () => {
        try {
          const session = await get_session(authBaseURL);

          if (!cancel_sync) {
            setSession(session);
          }
        } finally {
          if (!cancel_sync) {
            setLoading(false);
            setIsInitialSync(false);
          }
        }
      };

      sync_session();

      return () => {
        cancel_sync = true;
      };
    }
  }, [authBaseURL, isInitialSync]);

  const value = useMemo(() => {
    const sync_internal = async () => {
      const new_session = await get_session(authBaseURL);

      setLoading(false);
      setSession(new_session);

      return new_session;
    };

    return {
      authBaseURL,
      session,
      status: ((): SessionStatus =>
        loading ? 'loading' : session ? 'authenticated' : 'unauthenticated')(),
      async sync() {
        if (loading) {
          return null;
        }
        setLoading(true);

        return sync_internal();
      },
      async signIn(email: string, callback_url: string) {
        if (loading) {
          return null;
        }
        setLoading(true);

        await email_sign_in(authBaseURL, email, callback_url);

        return sync_internal();
      },
      async signOut() {
        if (loading) {
          return null;
        }
        setLoading(true);

        await sign_out(authBaseURL);

        const session = await sync_internal();

        if (session) {
          throw new Error('Post-sync `session` should be null after sign out!');
        }

        return session;
      },
    };
  }, [session, loading, authBaseURL]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = (options?: {
  allow_unauthenticated: boolean;
}): SessionContextValue => {
  const value: SessionContextValue | undefined = useContext(SessionContext);

  if (typeof value === 'undefined') {
    throw new Error('`useSession` must be wrapped in a `<SessionProvider />`');
  }

  const { allow_unauthenticated = false } = options ?? {};

  const needs_authentication =
    !allow_unauthenticated && value.status === 'unauthenticated';

  useEffect(() => {
    if (needs_authentication) {
      // redirect to client side sign in page, if needed
      const url = `/signin?${new URLSearchParams({
        error: 'SessionRequired',
        callbackUrl: window.location.href,
      })}`;
      window.location.href = url;
    }
  }, [needs_authentication]);

  return value;
};
