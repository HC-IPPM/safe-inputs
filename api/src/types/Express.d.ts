import type { IncomingHttpHeaders } from 'http';

import type { UserDocument } from 'src/schema/core/User/UserModel.ts';

// definition merging, this is the expected way to extend the Express types
declare global {
  namespace Express {
    interface Request {
      locals?: {
        verification_url?: string;
      };

      // TODO shouldn't these be picked up from definition merging? Something might be wrong
      // with my typing approach
      headers: IncomingHttpHeaders;
      body?: any;
      query?: any;
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
