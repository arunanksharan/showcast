import { supabase } from '../../utils/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Fetch all users from Supabase where the following condition is met:
    // is_active is true | rooms table: isJoined: true, everything else is false | exclude host's own room
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Error fetching users' });
    }

    if (data) {
      console.log('User who are active:', data);
    }

    // Return the list of users
    return res.status(200).json(data);
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
