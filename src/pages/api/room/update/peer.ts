import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../utils/supabaseClient'; // Adjust the path as needed
// import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  //   const session = await getServerSession({ req });

  //   console.log('Inside update peer');
  //   console.log(session);
  //   if (!session) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }

  const roomId = req.body.roomId;
  if (!roomId) {
    return res.status(400).json({ message: 'Room ID not found in session' });
  }

  try {
    // Extract roomId from the request body
    console.log('Inside update room');

    // Update the room status in Supabase
    const { error } = await supabase
      .from('rooms')
      .update({
        peer_is_joined: true,
      })
      .eq('huddle_room_id', roomId)
      .select();

    // Handle possible errors from Supabase
    if (error) {
      throw error;
    }

    // Return the updated room data
    return res.status(200).json(data);
  } catch (error: unknown) {
    // Handle any other errors
    return res
      .status(500)
      .json({ error: error.message || 'An unexpected error occurred' });
  }
}
