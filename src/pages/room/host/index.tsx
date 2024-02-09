// pages/room.tsx
import { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { supabase } from '../../../utils/supabaseClient';
import React from 'react';

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
  const userId = session.user?.id;
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
  console.log('Inside room/host/index.tsx');
  console.log('Own User Id', userId);
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');

  // Fetch all users who are sitting alone in their rooms
  const fetchRooms = async () => {
    const { data: roomsData, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('host_is_joined', true)
      .eq('peer_is_joined', false)
      .eq('host_is_connecting', false);

    // console.log(data)

    const { data: pairingsData, error: pairingsError } = await supabase
      .from('user_pairings')
      .select('*')
      .or(`host_user_id.eq.${userId},peer_user_id.eq.${userId}`);

    console.log('pairings', pairingsData);

    // collect all unique userids from host and peer to be removed from list of rooms
    // const filteredRooms = roomsData?.filter((room) => {
    //   // Check if there is a pairing where the current room's user ID is the peer user ID
    //   const isPairedAsHost = pairingsData?.some(
    //     (pairing) =>
    //       pairing.host_user_id === userId &&
    //       pairing.peer_user_id === room.user_id
    //   );

    //   // Check if there is a pairing where the current room's user ID is the host user ID
    //   const isPairedAsPeer = pairingsData?.some(
    //     (pairing) =>
    //       pairing.peer_user_id === userId &&
    //       pairing.host_user_id === room.user_id
    //   );

    //   // Keep the room if it's not paired as described in the problem statement
    //   return !(isPairedAsHost || isPairedAsPeer);
    // });

    // console.log('filteredRooms', filteredRooms);

    // Filter out the user's own room
    // ToDo: Change roomsData to filteredRooms when activating userPairings filter
    const availableRooms =
      roomsData?.filter((user) => user.user_id !== userId) || [];
    console.log(availableRooms);

    return availableRooms;
  };

  async function getRandomRoom() {
    const availableRooms = await fetchRooms();
    const randomRoom =
      (await availableRooms[
        Math.floor(Math.random() * availableRooms.length)
      ]) || {};

    return randomRoom;
  }

  const randomRoom = await getRandomRoom();
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('randomRoom');
  console.log(randomRoom);
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  let roomId = randomRoom?.huddle_room_id;

  // If there are rooms available, join a random room
  // update supabase rooms table with peer_is_joined = true
  // Update the room table with the new room id
  const { data: existingRoom, error } = await supabase.from('rooms').update([
    {
      host_is_connecting: false,
      host_is_joined: true,
      peer_is_joined: true,
      peer_user_id: userId,
    },
  ]);

  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('xxxxxxxxxx Huddle Existing Room Id - Start xxxxxxxxxx');
  console.log(`RoomId Is :: ${roomId}`);
  console.log('xxxxxxxxxx Huddle Existing Room Id - End xxxxxxxxxx');
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  // If there are no rooms available, create a new room
  // Call Huddle Create Room API
  // Update supabase rooms table with new room row with host_is_joined = true | rest all false
  if (!roomId) {
    const response = await fetch(
      'https://api.huddle01.com/api/v1/create-room',
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

    const data = await response.json();
    const roomId = data.data.roomId;
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('xxxxxxxxxx Huddle New Room Id - Start xxxxxxxxxx');
    console.log(`RoomId Is :: ${roomId}`);
    console.log('xxxxxxxxxx Huddle New Room Id - End xxxxxxxxxx');
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    // Update the room table with the new room id
    const { data: newRoom, error } = await supabase.from('rooms').insert([
      {
        user_id: userId,
        huddle_room_id: roomId,
        host_is_connecting: false,
        host_is_joined: true,
        peer_is_joined: false,
        peer_user_id: null,
      },
    ]);
  }

  return {
    redirect: {
      destination: `/room/host/${roomId}`,
      permanent: false,
    },
  };

  return { props: {} };
};
