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

  // ToDo: Shift this to /api/room/create and create a function createRoom there - use that to call the huddleAPI and get the roomId
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/room/create`,
    {
      method: 'POST',
      body: JSON.stringify({
        title: 'Huddle01 Room',
      }),
      headers: {
        'Content-type': 'application/json',
        'x-api-key': process.env.HUDDLE_API_KEY || '',
      },
    }
  );

  // const data = await response.json();

  const roomId = data.data.roomId;

  if (roomId) {
    // Insert the user id and roomId into the database under rooms table

    // const supabaseRes = await supabase();
    /**Insert the following data packet into rooms table - {sc_user_id | huddle_roomid | isConnecting: true | isJoined: false | peerIsJoined: false | peer_sc_id: null} */

    return {
      redirect: {
        destination: `/room/host/${roomId}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};
