import React from 'react';
import { useSession } from 'next-auth/react';

const HostRoom = () => {
  //   const { data: session } = useSession();
  //   if (session) {
  //     console.log(session);
  //   }
  return <div>Welcome to your Room!</div>;
};

export default HostRoom;
