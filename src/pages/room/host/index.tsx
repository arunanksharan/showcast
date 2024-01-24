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
  // console.log('/pages/room/host/index - serverSideProps', session);

  const roomId = session.user?.roomId;
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
  console.log('Inside room/host/index.tsx');
  console.log('roomId', roomId);
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');

  return {
    redirect: {
      destination: `/room/host/${roomId}`,
      permanent: false,
    },
  };

  return { props: {} };
};
