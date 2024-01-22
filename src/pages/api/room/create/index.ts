import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check the HTTP method of the request
  if (req.method === 'POST') {
    // Handle GET or POST request
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

    console.log('Room ID:', roomId);

    res.status(200).json({ data });
  } else {
    // If the request is neither GET nor POST, return a 405 Method Not Allowed
    res.status(405).end();
  }
}
