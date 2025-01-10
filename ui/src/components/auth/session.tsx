import type { PropsWithChildren } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
} from 'react';

import { useNavigate, useLocation } from 'react-router';

import type { Session } from './auth_utils.ts';
import {
  get_session,
  email_sign_in,
  sign_out,
  get_sign_in_path,
} from './auth_utils.ts';

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'syncing';
export interface SessionContextValue {
  session: Session | null;
  status: SessionStatus;
  authBaseURL: string;
  schedule_sync: () => void;
  signIn: (
    email: string,
    post_auth_redirect?: string,
  ) => Promise<Awaited<ReturnType<typeof email_sign_in>>>;
  signOut: () => Promise<Awaited<ReturnType<typeof sign_out>>>;
}

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export const SessionProvider = ({
  children,
  authBaseURL,
}: PropsWithChildren<{ authBaseURL: string }>) => {
  const [session, setSession] = useState<Session | null>(null);
  const [needsSync, setNeedsSync] = useState(true);

  useEffect(() => {
    if (needsSync) {
      let cancel_sync = false;

      const sync_session_initial = async () => {
        try {
          const session = await get_session(authBaseURL);

          if (!cancel_sync) {
            setSession(session);
          }
        } finally {
          if (!cancel_sync) {
            setNeedsSync(false);
          }
        }
      };

      sync_session_initial();

      return () => {
        cancel_sync = true;
      };
    }
  }, [authBaseURL, needsSync]);

  useLayoutEffect(() => {
    let cancel_reopen_sync = false;

    const sync_on_repoen = async () => {
      if (document.visibilityState === 'visible' && !cancel_reopen_sync) {
        setNeedsSync(true);
      }
    };

    document.addEventListener('visibilitychange', sync_on_repoen);

    return () => {
      cancel_reopen_sync = true;

      document.removeEventListener('visibilitychange', sync_on_repoen);
    };
  }, [authBaseURL]);

  const value = useMemo(() => {
    return {
      authBaseURL,
      session,
      status: ((): SessionStatus =>
        needsSync
          ? 'syncing'
          : session
            ? 'authenticated'
            : 'unauthenticated')(),
      schedule_sync() {
        setNeedsSync(true);
      },
      async signIn(email: string, post_auth_redirect?: string) {
        const response = await email_sign_in(
          authBaseURL,
          email,
          post_auth_redirect,
        );

        setNeedsSync(true);

        return response;
      },
      async signOut() {
        const response = await sign_out(authBaseURL);

        setNeedsSync(true);

        return response;
      },
    };
  }, [session, needsSync, authBaseURL]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = (options?: {
  allow_unauthenticated: boolean;
}): SessionContextValue => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
      navigate(
        get_sign_in_path({
          post_auth_redirect: pathname,
          message: 'SessionRequired',
        }),
      );
    }
  }, [needs_authentication, pathname, navigate]);

  return value;
};
