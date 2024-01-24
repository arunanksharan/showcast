// pages/room.tsx
import { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { supabase } from '@/src/utils/supabaseClient';

const RoomPage = () => {
  return <p>We are preparing your room...</p>;
};

export default RoomPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  // Console session
  console.log('/pages/room/index - serverSideProps', session);

  // ToDo: Shift this to /api/room/create and create a function createRoom there - use that to call the huddleAPI and get the roomId

  //
  const response = await fetch('https://api.huddle01.com/api/v1/create-room', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Huddle01 Room',
    }),
    headers: {
      'Content-type': 'application/json',
      'x-api-key': process.env.HUDDLE_API_KEY || '',
    },
  });

  const data = await response.json();
  const roomId = data.data.roomId;

  if (roomId) {
    // Insert the user id and roomId into the database under rooms table
    const { data, error } = await supabase.from('rooms').insert([
      {
        user_id: session.user?.id,
        huddle_room_id: roomId,
        host_is_connecting: true,
        host_is_joined: false,
        peer_is_joined: false,
      },
    ]);

    // Add room_id & huddle_room_id to session - Cannot do this
    // ToDo: Add room_id & huddle_room_id to state after redirection to /[roomId]

    if (error) {
      console.log('Error inserting data into rooms table', error);
      // ToDo: Redirect to error page | Handle error - Find more efficient way later
      return {
        redirect: {
          destination: `/room/error`,
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: `/room/host/${roomId}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};
