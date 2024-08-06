import {
  user_email_allowed_rule,
  user_email_can_own_collections_rule,
  user_email_is_super_user_rule,
} from './authz.ts';

const throws_error_with_status_code = (
  callable: () => void,
  expected_status_code: number,
) => {
  try {
    callable();
    return false;
  } catch (error) {
    return (
      error instanceof Error &&
      'status' in error &&
      error.status === expected_status_code
    );
  }
};

describe('User authorization rules', () => {
  const ORIGINAL_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('user_email_allowed_rule rule...', () => {
    describe('with AUTHZ_EMAIL_HOSTS_ALLOWED as wildcard', () => {
      beforeEach(() => {
        process.env = {
          ...ORIGINAL_ENV,
          AUTHZ_EMAIL_HOSTS_ALLOWED: '*',
        };
      });

      it('Throws a 400 on invalid email strings', async () => {
        [
          'just-a-host.com',
          'just-a-string',
          'email-with-invalid-host@h o s t.com',
        ].forEach((email) =>
          expect(
            throws_error_with_status_code(
              () => user_email_allowed_rule({ email }),
              400,
            ),
          ).toBe(true),
        );
      });

      it('Passes any valid email without throwing', async () => {
        ['valid@valid.com', 'who.ever@whatever.com'].forEach((email) =>
          expect(() => user_email_allowed_rule({ email })).not.toThrow(),
        );
      });
    });

    describe('with AUTHZ_EMAIL_HOSTS_ALLOWED as an allow list', () => {
      beforeEach(() => {
        process.env = {
          ...ORIGINAL_ENV,
          AUTHZ_EMAIL_HOSTS_ALLOWED: 'host1.com,host2.net',
          // minor leak, src/env.ts asserts relationships between AUTHZ env var values we need to satisfy
          // consider mocking the return of get_env instead of modifying env process.env for tests?
          AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS: 'host1.com',
          AUTHZ_SUPER_ADMINS: 'admin@host1.com',
        };
      });

      it('Throws a 400 on invalid email strings', async () => {
        [
          'just-a-host.com',
          'just-a-string',
          'email-with-invalid-host@h o s t.com',
        ].forEach((email) =>
          expect(
            throws_error_with_status_code(
              () => user_email_allowed_rule({ email }),
              400,
            ),
          ).toBe(true),
        );
      });

      it('Throws 403 on emails from non-approved hosts', async () => {
        ['host3@host3.com', 'host1org@host1.org'].forEach((email) =>
          expect(
            throws_error_with_status_code(
              () => user_email_allowed_rule({ email }),
              403,
            ),
          ).toBe(true),
        );
      });

      it('Passes emails from approved hosts without throwing', async () => {
        ['host1@host1.com', 'host2@host2.net'].forEach((email) =>
          expect(() => user_email_allowed_rule({ email })).not.toThrow(),
        );
      });
    });
  });

  describe('user_email_can_own_collections_rule rule...', () => {
    beforeEach(() => {
      process.env = {
        ...ORIGINAL_ENV,
        AUTHZ_EMAIL_HOSTS_ALLOWED: 'privileged.com,unprivileged.net',
        AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS: 'privileged.com',
        AUTHZ_SUPER_ADMINS: 'admin@privileged.com,admin2@privileged.com',
      };
    });

    it('Throws 403 on non-privileged users', async () => {
      expect(
        throws_error_with_status_code(
          () =>
            user_email_can_own_collections_rule({
              email: 'admin@unprivileged.net',
            }),
          403,
        ),
      ).toBe(true);
    });

    it('Passes privileged users without throwing', async () => {
      ['johndoe@privileged.com', 'admin@privileged.com'].forEach((email) =>
        expect(() =>
          user_email_can_own_collections_rule({ email }),
        ).not.toThrow(),
      );
    });
  });

  describe('user_email_is_super_user_rule rule...', () => {
    beforeEach(() => {
      process.env = {
        ...ORIGINAL_ENV,
        AUTHZ_EMAIL_HOSTS_ALLOWED: 'privileged.com,unprivileged.net',
        AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS: 'privileged.com',
        AUTHZ_SUPER_ADMINS: 'admin@privileged.com,admin2@privileged.com',
      };
    });

    it('Throws 403 on non-super-admin', async () => {
      ['not-admin@privileged.com', 'admin@unprivileged.net'].forEach((email) =>
        expect(
          throws_error_with_status_code(
            () => user_email_is_super_user_rule({ email }),
            403,
          ),
        ).toBe(true),
      );
    });

    it('Passes super-admins without throwing', async () => {
      ['admin@privileged.com', 'admin2@privileged.com'].forEach((email) =>
        expect(() => user_email_is_super_user_rule({ email })).not.toThrow(),
      );
    });
  });
});
