import {
  is_valid_user,
  is_valid_privileged_user,
  is_valid_super_user,
} from 'src/authz.ts';

const test_both_email_string_and_user_stub = (
  emails: string[],
  test: (email: string | { email: string }) => void,
) =>
  emails.forEach((email) => {
    test(email);
    test({ email });
  });

describe('User authorization rules', () => {
  const ORIGINAL_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('is_valid_user rule...', () => {
    describe('with AUTHZ_EMAIL_HOSTS_ALLOWED as wildcard', () => {
      beforeEach(() => {
        process.env = {
          ...ORIGINAL_ENV,
          AUTHZ_EMAIL_HOSTS_ALLOWED: '*',
        };
      });

      it('Throws on invalid email strings', async () => {
        test_both_email_string_and_user_stub(
          [
            'just-a-host.com',
            'just-a-string',
            'email-with-invalid-host@h o s t.com',
          ],
          (email) => expect(() => is_valid_user(email)).toThrow(),
        );
      });

      it('Accepts any valid email', async () => {
        test_both_email_string_and_user_stub(
          ['valid@valid.com', 'who.ever@whatever.com'],
          (email) => expect(is_valid_user(email)).toBe(true),
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

      it('Throws on invalid email strings', async () => {
        test_both_email_string_and_user_stub(
          [
            'just-a-host.com',
            'just-a-string',
            'email-with-invalid-host@h o s t.com',
          ],
          (email) => expect(() => is_valid_user(email)).toThrow(),
        );
      });

      it('Denies emails from non-approved hosts', async () => {
        test_both_email_string_and_user_stub(
          ['host3@host3.com', 'host1org@host1.org'],
          (email) => expect(is_valid_user(email)).toBe(false),
        );
      });

      it('Accepts emails from approved hosts', async () => {
        test_both_email_string_and_user_stub(
          ['host1@host1.com', 'host2@host2.net'],
          (email) => expect(is_valid_user(email)).toBe(true),
        );
      });
    });
  });

  describe('is_valid_privileged_user rule...', () => {
    beforeEach(() => {
      process.env = {
        ...ORIGINAL_ENV,
        AUTHZ_EMAIL_HOSTS_ALLOWED: 'privileged.com,unprivileged.net',
        AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES: 'privileged.com',
        AUTHZ_SUPER_ADMINS: 'admin@privileged.com,admin2@privileged.com',
      };
    });

    it('Denies non-privileged users', async () => {
      test_both_email_string_and_user_stub(
        ['admin@unprivileged.net'],
        (email) => expect(is_valid_privileged_user(email)).toBe(false),
      );
    });

    it('Accepts privileged users', async () => {
      test_both_email_string_and_user_stub(
        ['johndoe@privileged.com', 'admin@privileged.com'],
        (email) => expect(is_valid_privileged_user(email)).toBe(true),
      );
    });
  });

  describe('is_valid_super_user rule...', () => {
    beforeEach(() => {
      process.env = {
        ...ORIGINAL_ENV,
        AUTHZ_EMAIL_HOSTS_ALLOWED: 'privileged.com,unprivileged.net',
        AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES: 'privileged.com',
        AUTHZ_SUPER_ADMINS: 'admin@privileged.com,admin2@privileged.com',
      };
    });

    it('Denies non-super-admin', async () => {
      test_both_email_string_and_user_stub(
        ['not-admin@privileged.com', 'admin@unprivileged.net'],
        (email) => expect(is_valid_super_user(email)).toBe(false),
      );
    });

    it('Accepts super-admins', async () => {
      test_both_email_string_and_user_stub(
        ['admin@privileged.com', 'admin2@privileged.com'],
        (email) => expect(is_valid_super_user(email)).toBe(true),
      );
    });
  });
});
