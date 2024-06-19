import type { IncomingHttpHeaders } from 'http';

// definition merging, this is the expected way to extend the Express types
declare global {
  namespace Express {
    interface Request {
      headers: IncomingHttpHeaders;
      locals?: {
        verification_url?: string;
      };
      body?: any;
      query?: any;
    }
    interface User {
      email?: string;
    }
  }
}

// empty export to make this unambiguously a module to supress TS errors over import statements
export {};
