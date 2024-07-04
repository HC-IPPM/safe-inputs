import {
  validate_user_email_allowed,
  validate_user_can_have_privileges,
  validate_user_is_super_user,
} from 'src/authz.ts';

const test_both_email_string_and_user_stub = (
  emails: string[],
  test: (email: string | { email: string }) => void,
) =>
  emails.forEach((email) => {
    test(email);
    test({ email });
  });

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

  describe('validate_user_email_allowed rule...', () => {
    describe('with AUTHZ_EMAIL_HOSTS_ALLOWED as wildcard', () => {
      beforeEach(() => {
        process.env = {
          ...ORIGINAL_ENV,
          AUTHZ_EMAIL_HOSTS_ALLOWED: '*',
        };
      });

      it('Throws a 400 on invalid email strings', async () => {
        test_both_email_string_and_user_stub(
          [
            'just-a-host.com',
            'just-a-string',
            'email-with-invalid-host@h o s t.com',
          ],
          (email) =>
            expect(
              throws_error_with_status_code(
                () => validate_user_email_allowed(email),
                400,
              ),
            ).toBe(true),
        );
      });

      it('Passes any valid email without throwing', async () => {
        test_both_email_string_and_user_stub(
          ['valid@valid.com', 'who.ever@whatever.com'],
          (email) =>
            expect(() => validate_user_email_allowed(email)).not.toThrow(),
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
          AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES: 'host1.com',
          AUTHZ_SUPER_ADMINS: 'admin@host1.com',
        };
      });

      it('Throws a 400 on invalid email strings', async () => {
        test_both_email_string_and_user_stub(
          [
            'just-a-host.com',
            'just-a-string',
            'email-with-invalid-host@h o s t.com',
          ],
          (email) =>
            expect(
              throws_error_with_status_code(
                () => validate_user_email_allowed(email),
                400,
              ),
            ).toBe(true),
        );
      });

      it('Throws 403 on emails from non-approved hosts', async () => {
        test_both_email_string_and_user_stub(
          ['host3@host3.com', 'host1org@host1.org'],
          (email) =>
            expect(
              throws_error_with_status_code(
                () => validate_user_email_allowed(email),
                403,
              ),
            ).toBe(true),
        );
      });

      it('Passes emails from approved hosts without throwing', async () => {
        test_both_email_string_and_user_stub(
          ['host1@host1.com', 'host2@host2.net'],
          (email) =>
            expect(() => validate_user_email_allowed(email)).not.toThrow(),
        );
      });
    });
  });

  describe('validate_user_can_have_privileges rule...', () => {
    beforeEach(() => {
      process.env = {
        ...ORIGINAL_ENV,
        AUTHZ_EMAIL_HOSTS_ALLOWED: 'privileged.com,unprivileged.net',
        AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES: 'privileged.com',
        AUTHZ_SUPER_ADMINS: 'admin@privileged.com,admin2@privileged.com',
      };
    });

    it('Throws 403 on non-privileged users', async () => {
      test_both_email_string_and_user_stub(
        ['admin@unprivileged.net'],
        (email) =>
          expect(
            throws_error_with_status_code(
              () => validate_user_can_have_privileges(email),
              403,
            ),
          ).toBe(true),
      );
    });

    it('Passes privileged users without throwing', async () => {
      test_both_email_string_and_user_stub(
        ['johndoe@privileged.com', 'admin@privileged.com'],
        (email) =>
          expect(() => validate_user_can_have_privileges(email)).not.toThrow(),
      );
    });
  });

  describe('validate_user_is_super_user rule...', () => {
    beforeEach(() => {
      process.env = {
        ...ORIGINAL_ENV,
        AUTHZ_EMAIL_HOSTS_ALLOWED: 'privileged.com,unprivileged.net',
        AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES: 'privileged.com',
        AUTHZ_SUPER_ADMINS: 'admin@privileged.com,admin2@privileged.com',
      };
    });

    it('Throws 403 on non-super-admin', async () => {
      test_both_email_string_and_user_stub(
        ['not-admin@privileged.com', 'admin@unprivileged.net'],
        (email) =>
          expect(
            throws_error_with_status_code(
              () => validate_user_is_super_user(email),
              403,
            ),
          ).toBe(true),
      );
    });

    it('Passes super-admins without throwing', async () => {
      test_both_email_string_and_user_stub(
        ['admin@privileged.com', 'admin2@privileged.com'],
        (email) =>
          expect(() => validate_user_is_super_user(email)).not.toThrow(),
      );
    });
  });
});
