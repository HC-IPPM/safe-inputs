import type { UserDocument } from 'src/schema/core/User/UserModel.ts';

// definition merging, this is the expected way to extend the Express types
declare global {
  namespace Express {
    // Don't consume Express.Request directly! The correct, complete, type is the `Request` type
    // exported by `express-serve-static-core`, which itself Express.Request (including types added by
    // the definition merging occuring here) but adds the request object properties and methods
    interface Request {
      locals?: {
        verification_url?: string;
      };
    }
    interface User {
      id?: string;
      email?: string;
      mongoose_doc?: UserDocument;
    }
    interface AuthenticatedUser extends User {
      // User instance post passport session deserialization
      id: string;
      email: string;
      mongoose_doc: UserDocument;
    }
  }
}

// empty export to make this unambiguously a module to supress TS errors over import statements
export {};
