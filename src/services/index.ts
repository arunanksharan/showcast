import axios from 'axios';
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from './config';

const huddleRoomCreatExternalURL = '/create-room';

export const createHuddleRoomExternal = async () => {
  const response = await axios(
    postRequest(huddleRoomCreatExternalURL, {}, process.env.HUDDLE_API_KEY)
  );
  return response.data;
};

// const response = await fetch(
//   `${process.env.NEXT_PUBLIC_BASE_URL}/api/room/create`,
//   {
//     method: 'POST',
//     body: JSON.stringify({
//       title: 'Huddle01 Room',
//     }),
//     headers: {
//       'Content-type': 'application/json',
//       'x-api-key': process.env.HUDDLE_API_KEY || '',
//     },
//   }
// );

// const data = await response.json();
