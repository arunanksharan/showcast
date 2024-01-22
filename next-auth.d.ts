import NextAuth from 'next-auth';

// ToDo: Extend User, token and session object to handle custom fields.
declare module 'next-auth' {
  interface User {
    fc_id: string;
  }

  // interface Session {
  //   user: { name: string };
  // }
}
