import { Room, User } from '@/types/room';
import { supabase } from '../../../../utils/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Get the user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ToDo: Remove farcaster details of peer users (Changed select * to select id - should work)
    const { data: userPool, error } = await supabase
      .from('rooms')
      .select(
        `
      *
    `
      )
      .eq('host_is_connecting', false)
      .eq('host_is_joined', true)
      .eq('peer_is_joined', false);

    if (error) {
      console.error('Error fetching user pool:', error);
    }

    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // console.log('All User Pool');
    // console.log(JSON.stringify(userPool, null, 2));
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    const user_id = session.user?.id;

    const filteredUserPool =
      userPool?.filter((user) => user.user_id !== user_id) || [];
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // console.log('Filtered User Pool');
    // console.log(JSON.stringify(filteredUserPool, null, 2));
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    const filteredUserPoolIds = filteredUserPool.map((user) => user.user_id);
    console.log('filterUserPoolIds:', filteredUserPoolIds);

    const { data: fUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('id', filteredUserPoolIds);

    const filteredUsers: User[] = fUsers || [];

    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // console.log('filterUsers:', filteredUsers);

    const mergeRoomsAndUsers = (rooms: Room[], users: User[]) => {
      return rooms.map((room) => {
        const user = users.find((user) => user.id === room.user_id);
        if (user) {
          // Merge user properties into the room object
          return {
            ...room,
            fc_username: user.fc_username,
            fc_id: user.fc_id,
            fc_image_url: user.fc_image_url,
            session_huddle_room_id: user.session_huddle_room_id,
          };
        }
        return room;
      });
    };

    const userRoomPool = mergeRoomsAndUsers(filteredUserPool, filteredUsers);

    // Return the list of users
    return res.status(200).json(userRoomPool);
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
