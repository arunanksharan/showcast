import { createAppClient, viemConnector } from '@farcaster/auth-client';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '../../../utils/supabaseClient';

export const authHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);

export default authHandler;

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials, req) {
        const {
          body: { csrfToken },
        } = req;

        const appClient = createAppClient({
          ethereum: viemConnector(),
        });

        const verifyResponse = await appClient.verifySignInMessage({
          message: credentials?.message as string,
          signature: credentials?.signature as `0x${string}`,
          domain: `${process.env['NEXTAUTH_URL']}`,
          nonce: csrfToken,
        });
        const { success, fid } = verifyResponse;
        console.log('Inside authorize', success, fid);

        if (!success) {
          console.log('Inside NOT success');
          return null;
        }

        // Preparing the data for returning user object
        const fc_id = fid.toString();
        let sc_user_id = null;

        // Get a new huddle room id
        // const response = await fetch(
        //   'https://api.huddle01.com/api/v1/create-room',
        //   {
        //     method: 'POST',
        //     body: JSON.stringify({
        //       title: 'Huddle01 Room',
        //     }),
        //     headers: {
        //       'Content-type': 'application/json',
        //       'x-api-key': process.env.HUDDLE_API_KEY || '',
        //     },
        //   }
        // );

        // const data = await response.json();
        // const roomId = data.data.roomId;
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log('xxxxxxxxxx Huddle New Room Id - Start xxxxxxxxxx');
        // console.log(`RoomId Is :: ${roomId}`);
        // console.log('xxxxxxxxxx Huddle New Room Id - End xxxxxxxxxx');
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

        // if (roomId) {
        const { data: existingUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('fc_id', fc_id);

        console.log('xxxxxxxxxx Check for Existing User Start xxxxxxxxxx');
        console.log(`Exsiting User Length: ${existingUser.length}`);
        console.log(`Existing Users: ${JSON.stringify(existingUser, null, 2)}`);
        console.log(`Error in Existing User: ${error}`);
        console.log('xxxxxxxxxx Check for Existing User End xxxxxxxxxx');
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

        // Insert new user
        if (existingUser.length == 0) {
          const { data: newUser, error } = await supabase
            .from('users')
            .insert([
              {
                fc_id: fc_id,
                fc_username: credentials?.name as string,
                fc_image_url: credentials?.pfp as string,
                is_active: true,
                // session_huddle_room_id: roomId,
              },
            ])
            .select();
          console.log('xxxxxxxxxx No Existing User Found - Start xxxxxxxxxx');
          console.log(
            'xxxxxxxxxx No Existing User Found - Inserting new user xx'
          );
          console.log('New User:', newUser);
          console.log('Error:', error);
          sc_user_id = newUser[0].id;
          console.log('sc_user_id_new:', sc_user_id);
          console.log('xxxxxxxxxx No Existing User Found - End xxxxxxxxxx');
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        }

        // Update is_active=true & session_huddle_room_id=''
        if (existingUser.length == 1) {
          console.log('xxxxxxxxxx Existing User Found - Start xxxxxxxxxx');
          console.log('xxxxxxxxxx Existing User Found - Updating xxxxxxx');
          console.log('Exisitng User: ', existingUser);
          sc_user_id = existingUser[0].id;
          console.log('sc_user_id_existing:', sc_user_id);
          console.log('xxxxxxxxxx Existing User Found - End xxxxxxxxxx');
          const { data: updatedUser, error } = await supabase
            .from('users')
            .update({ is_active: true }) // session_huddle_room_id: roomId
            .eq('fc_id', fc_id)
            .select();
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
          console.log('xxxxxxxxxx Updated Existing User xxxxxxx');
          console.log('Updated User:', updatedUser);
          console.log('Error:', error);
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        }

        // Update rooms table
        // Insert new rooms row with this user_id
        // Insert the user id and roomId into the database under rooms table
        // const { data: newRoom, error: insertRoomError } = await supabase
        //   .from('rooms')
        //   .insert([
        //     {
        //       user_id: sc_user_id,
        //       huddle_room_id: roomId,
        //       host_is_connecting: true,
        //       host_is_joined: false,
        //       peer_is_joined: false,
        //     },
        //   ])
        //   .select();
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log('xxxxxxxxxx Updated Rooms Table User xxxxxxx');
        // console.log(
        //   `New Room for ${sc_user_id} from rooms table: ${newRoom[0].id}`
        // );
        // console.log('New Room: ', newRoom);
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

        // Return the user object
        return {
          id: sc_user_id,
          fcId: fc_id,
          // roomId: roomId,
          name: credentials?.name as string,
          image: credentials?.pfp as string,
        };
        // } else {
        //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        //   console.log('Room could not be created! Please try again');
        //   return null;
        // }

        // End of authorise function
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log('xxxxxxxxxxxxxxx SIGN IN CALLBACK xxxxxxxxx');
      // console.log('Inside signIn callback: user:', user);
      // console.log('Inside signIn callback: account:', account);
      // console.log('Inside signIn callback: profile:', profile);
      // console.log('Inside signIn callback: email:', email);
      // console.log('Inside signIn callback: credentials:', credentials);
      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          fcId: user.fcId,
          // roomId: user.roomId,
        };
      }

      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log('xxxxxxxxxxxxxxx JWT CALLBACK xxxxxxxxx');
      // console.log('token', token);
      // console.log('user', user);
      // console.log('account', account);
      // console.log('profile', profile);
      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      return token;
    },
    async session({ session, token, user }) {
      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log('xxxxxxxxxxxxxxx SESSION CALLBACK xxxxxxxxx');
      // console.log('session', session, token, user);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          fcId: token.fcId,
          // roomId: token.roomId,
        },
      };
    },
  },
  // events: {
  //   signOut: async (message) => {
  //     // message has a `session` property
  //     console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //     console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //     console.log('xxxxxxxxxx Sign Out Event xxxxxxx');
  //     console.log('Message:', message);
  //     console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //     console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  //     // Update the user's status to inactive
  //     const markUserAsInactive = async (userId: string) => {
  //       const { data: updatedUser, error } = await supabase
  //         .from('users')
  //         .update({ is_active: false, session_huddle_room_id: null })
  //         .eq('id', userId)
  //         .select();

  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //       console.log('xxxxxxxxxx Updated User Status xxxxxxx');
  //       console.log('Updated User:', updatedUser);
  //       console.log('Error:', error);
  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //     };

  //     const markRoomAsInactive = async (roomId: string) => {
  //       const { data: updatedRoom, error } = await supabase
  //         .from('rooms')
  //         .update({
  //           host_is_connecting: false,
  //           host_is_joined: false,
  //           peer_is_joined: false,
  //         })
  //         .eq('huddle_room_id', roomId)
  //         .select();

  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //       console.log('xxxxxxxxxx Updated Room Status xxxxxxx');
  //       console.log('Updated Room:', updatedRoom);
  //       console.log('Error:', error);
  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //     };
  //     if (message.session) {
  //       await markUserAsInactive(message.session.user.id);
  //       await markRoomAsInactive(message.session.user.roomId);
  //     }
  //     if (message.token) {
  //       await markUserAsInactive(message.token.id);
  //       await markRoomAsInactive(message.token.roomId);
  //     }
  //   },
  // },
};
