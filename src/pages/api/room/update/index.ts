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
  const session = await getServerSession(req, res, authOptions);
  console.log('line 23 Inside update host');
  console.log(req.body);

  const roomId = req.body.roomId;
  console.log('27 Inside update host roomId:', roomId);
  if (!roomId) {
    return res.status(400).json({ message: 'Room ID not found in session' });
  }

  try {
    // Update the room status in Supabase
    console.log('line 45 Inside updateRoomStatus', roomId);
    const { error } = await supabase
      .from('rooms')
      .update({
        host_is_joined: true,
        host_is_connecting: false,
        peer_is_joined: false,
      })
      .eq('huddle_room_id', roomId);

    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('xxxxxxxxxx Update Room Status xxxxxxx');
    console.log('Error:', error);
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    // Return the updated room data
    return res.status(200).json({ message: 'Room status updated' });
  } catch (error: unknown) {
    // Handle any other errors
    console.log('Error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'An unexpected error occurred' });
  }
}
