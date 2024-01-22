import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createAppClient, viemConnector } from '@farcaster/auth-client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { supabase } from '../../../utils/supabaseClient';

export const authHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    debug: true,
    providers: [
      CredentialsProvider({
        name: 'Sign in with Farcaster',
        credentials: {
          message: {
            label: 'Message',
            type: 'text',
            placeholder: '0x0',
          },
          signature: {
            label: 'Signature',
            type: 'text',
            placeholder: '0x0',
          },
          // In a production app with a server, these should be fetched from
          // your Farcaster data indexer rather than have them accepted as part
          // of credentials.
          name: {
            label: 'Name',
            type: 'text',
            placeholder: '0x0',
          },
          pfp: {
            label: 'Pfp',
            type: 'text',
            placeholder: '0x0',
          },
        },
        async authorize(credentials) {
          const {
            body: { csrfToken },
          } = req;

          const appClient = createAppClient({
            ethereum: viemConnector(),
          });

          const verifyResponse = await appClient.verifySignInMessage({
            message: credentials?.message as string,
            signature: credentials?.signature as `0x${string}`,
            domain: 'example.com',
            nonce: csrfToken,
          });
          const { success, fid } = verifyResponse;
          console.log('Inside authorize', success, fid);

          if (!success) {
            console.log('Inside NOT success');
            return null;
          }

          return {
            id: fid.toString(),
            name: credentials?.name,
            image: credentials?.pfp,
          };
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log('xxxxxxxxxxxxxxx SIGN IN CALLBACK xxxxxxxxx');
        console.log('Inside signIn callback: user:', user);
        console.log('Inside signIn callback: account:', account);
        console.log('Inside signIn callback: profile:', profile);
        console.log('Inside signIn callback: email:', email);
        console.log('Inside signIn callback: credentials:', credentials);
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('fc_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          console.log('Inside error');
          console.log(error);
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
              {
                fc_id: user.id,
                fc_username: user.name,
                fc_image_url: user.image,
                is_active: true,
              },
            ]);
          if (insertError) {
            console.error('Error inserting new user:', insertError);
            return false; // Return false to not sign in the user
          }
        } else if (error) {
          console.error('Error checking for user:', error);
          return false; // Return false to not sign in the user
        }

        return true;
      },
      async redirect({ url, baseUrl }) {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log('xxxxxxxxxxxxxxx REDIRECT CALLBACK xxxxxxxxx');
        console.log('url', url);
        console.log('baseUrl', baseUrl);
        // console.log('roomUrl', user.roomUrl);
        // console.log('url', `${baseUrl}/room/${url}`);
        return url;
      },
      async jwt({ token, user, account, profile }) {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log('xxxxxxxxxxxxxxx JWT CALLBACK xxxxxxxxx');
        console.log('token', token);
        console.log('user', user);
        console.log('account', account);
        console.log('profile', profile);
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

        // if (user) {
        //   token.roomId = user.roomId;
        // }
        return token;
      },
      async session({ session, token, user }) {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log('xxxxxxxxxxxxxxx SESSION CALLBACK xxxxxxxxx');
        console.log('session', session, token, user);
        return { ...session, id: '123' };
      },
    },
  });

export default authHandler;

// Solutions:
// 1. use signIn callback - to create roomId and redirect to /hostroom/[roomId]
// 2. use redirect callback - to create roomId and redirect to /hostroom/[roomId]
