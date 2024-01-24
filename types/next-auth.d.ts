import NextAuth from 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// ToDo: Extend User, token and session object to handle custom fields.
declare module 'next-auth' {
  interface User extends DefaultUser {
    fcId: string;
    roomId?: string;
  }

  interface Session extends DefaultSession {
    user?: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    fcId?: string;
    roomId?: string;
  }
}
