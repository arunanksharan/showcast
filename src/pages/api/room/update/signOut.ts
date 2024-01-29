import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../utils/supabaseClient'; // Adjust the path as needed
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // const session = await getServerSession(req, res, authOptions);
  console.log('line 23 Inside update host');
  console.log(req.body);

  const roomId = req.body.roomId;
  const userId = req.body.userId;
  console.log('27 Inside update host roomId:', roomId);
  if (!roomId) {
    return res.status(400).json({ message: 'Room ID not found in session' });
  }

  // Mark user as inactive
  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({ is_active: false, session_huddle_room_id: null })
    .eq('id', userId)
    .select();

  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('xxxxxxxxxx Updated User Status xxxxxxx');
  console.log('Updated User:', updatedUser);
  console.log('Error:', error);
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  // Update room status - similar to leave room - host & peer cases
  const { data: roomData, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('huddle_room_id', roomId);
  console.log('line 36 Inside update host roomData:', roomData);
  console.log('line 37 Inside update host roomError:', roomError);
  if (roomError) {
    return res
      .status(500)
      .json({ error: roomError.message || 'An unexpected error occurred' });
  }
  if (!roomData || roomData.length === 0) {
    return res.status(404).json({ message: 'Room not found' });
  }
  const room = roomData[0];
  console.log('line 45 Inside update host room:', room);
  const isHost = room.user_id === userId;
  console.log('line 47 Inside update host isHost:', isHost);

  if (isHost) {
    // If original host leaves - peer becomes the host

    // if peer is not null - make peer the host
    if (room.peer_user_id) {
      const { data, error } = await supabase
        .from('rooms')
        .update({
          user_id: room.peer_user_id,
          host_is_joined: true,
          peer_is_joined: false,
          peer_user_id: null,
        })
        .eq('huddle_room_id', roomId)
        .select();
    } else {
      const { data, error } = await supabase
        .from('rooms')
        .update({
          user_id: null,
          host_is_joined: false,
          peer_is_joined: false,
          peer_user_id: null,
        })
        .eq('huddle_room_id', roomId)
        .select();
    }
  } else {
    // If peer leaves - nothing changes but the status
    const { data, error } = await supabase
      .from('rooms')
      .update({
        host_is_joined: true,
        peer_is_joined: false,
        peer_user_id: null,
      })
      .eq('huddle_room_id', roomId)
      .select();
  }

  return res
    .status(200)
    .json({ message: 'User and room status after signOut updated' });
}
