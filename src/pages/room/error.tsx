import React from 'react';
import { useRouter } from 'next/router';

const RoomPageError = () => {
  const router = useRouter();
  const handleTryAgainClick = () => {
    router.push('/room');
  };
  return (
    <div>
      <div>Could Not cretae a room to join</div>
      <button onClick={handleTryAgainClick}>Click here to try again</button>
    </div>
  );
};

export default RoomPageError;
