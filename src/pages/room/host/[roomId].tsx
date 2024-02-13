import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from '@huddle01/react/hooks';
import { signOut, useSession } from 'next-auth/react';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import RemotePeer from '../../../components/RemotePeer/RemotePeer';
import { TPeerMetadata } from '../../../utils/types';
// import { set } from '@project-serum/anchor/dist/cjs/utils/features';
import Image from 'next/image';
import { useGlobalContext } from '../../../context/GlobalContext';
import { UserAvatar } from './UserAvatar';
import { useProfile } from '@farcaster/auth-kit';
import classNames from 'classnames';
const inter = Inter({ subsets: ['latin'] });

type Props = {
  token: string;
};

export default function HostRoom() {
  const [displayName, setDisplayName] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const session = useSession();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [joinedAsHost, setJoinedAsHost] = useState<boolean>(false);
  const [joinedAsPeer, setJoinedAsPeer] = useState<boolean>(false);
  const [peerJoined, setPeerJoined] = useState<boolean>(false);
  const { rooms, updateRooms } = useGlobalContext();

  const { isAuthenticated } = useProfile();
  // const isLoading = useRef(false);
  // const [selectedPeerRoomId, setSelectedPeerRoomId] = useState<string>('');

  const { joinRoom, leaveRoom, state } = useRoom({
    onJoin: async (room) => {
      console.log('onJoin', room);
      updateMetadata({ displayName: 'User1' });
    },
    onPeerJoin: (peer) => {
      console.log('onPeerJoin', peer);
    },
    onLeave: async () => {
      console.log('Successfully left the room');
    },
  });

  async function updateRoomStatusOnLeave() {
    // If room.user_id in supabase = session.user.id, then update room status as

    const roomId = router.query.roomId;
    console.log('RoomId from updateRoomStatus', roomId);

    const userId = session.data?.user?.id;
    console.log('UserId from updateRoomStatus', userId);

    const response = await fetch('/api/room/update', {
      method: 'POST',
      body: JSON.stringify({ roomId, userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('Data from updateRoomStatus', data);
  }

  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();
  const { updateMetadata } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();
  // const [peerIsSelected, setPeerIsSelected] = useState<boolean>(false);

  // Autmatically join room and remove the idle aspect of code
  const roomId = router.query.roomId as string;
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('96 PeerIds:', peerIds);
  console.log('97 State:', state);
  console.log('98 RoomId:', roomId);
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  // Every time roomId changes, join the room
  useEffect(() => {

    join();
  }, [router.query]); // roomId

  // Video Ref and Stream
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (shareStream && screenRef.current) {
      screenRef.current.srcObject = shareStream;
    }
  }, [shareStream]);

  const join = async () => {
    if (!roomId) return;
    // isLoading.current = true;
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('Inside useEffect - joinRoom - first time');
    console.log('107 RoomId:', roomId);
    console.log('108 State: ', state);
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    // Get Access Token for the room
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('113 Inside useEffect - getAccessToken');
    const response = await fetch('/api/room/getAccessToken', {
      method: 'POST',
      body: JSON.stringify({ roomId }),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    const data = await response.json();
    console.log('122 Data from getAccessToken', data);
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('124 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    //   const token = await data.token;

    await joinRoom({
      roomId,
      token: data.token,
    });
    await enableVideo();
    await enableAudio();
  };

  const handleLeaveRoom = async () => {
    await updateRoomStatusOnLeave();
    // const roomId = session.data?.user?.roomId;
    console.log('Inside Leave Room');
    console.log('RoomId from handleLeaveRoom', router.query.roomId);
    await leaveRoom();
    await router.push(`/room/host/`);
  };

  return (
    <main
      className={`flex h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] flex-col items-stretch p-4`}
    >
      <div className="mb-4 py-3 flex flex-row justify-between items-center rounded-2xl bg-hero-bg w-full">
        <Image
          src="/logo.svg"
          alt="showcast logo"
          width={202}
          height={41}
          className="ml-0 h-6 py-2"
        />

        <UserAvatar />
      </div>
      <div className="flex-1 h-full w-full max-w-full max-h-max border relative">
        {isVideoOn && (
          <div className={classNames(
            "rounded-xl absolute",
            !peerIds.length && "h-full w-full",
            peerIds.length && "bottom-4 right-4 h-36 w-auto z-10"
          )}>
            <video
              ref={videoRef}
              className={classNames(
                "object-cover rounded-xl max-w-full w-full h-full",
                state !== 'connected' && "animate-pulse",
                // peerIds.length && "aspect-video"
              )}
              autoPlay
              muted
            />
          </div>
        )}


        <div className="rounded-xl absolute h-full w-full ">
          {/* {peerIds.map((peerId) =>
            peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
          )} */}
        </div>

      </div>
      {/* {state === 'connected' && <ChatBox />} */}
      <div className="flex flex-row md:fixed bottom-10 justify-center w-full left-0 mt-4">
        {/* {session && (
          <button
            className="border-1 border-solid border-hero-bg text-white font-manrope py-2 px-8 rounded-full flex items-center justify-center bg-hero-bg hover:bg-white hover:text-purple-700 transition-all mx-4"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        )} */}

        {state === 'connected' && (
          <>
            <button
              type="button"
              className="border-1 border-solid border-hero-bg bg-hero-bg text-white font-manrope py-2 px-8 rounded-full flex items-center justify-center hover:bg-hero-bg transition-all mx-4 cursor-pointer"
              onClick={handleLeaveRoom}
            >
              Leave
            </button>
          </>
        )}
      </div>
    </main>
  );
}


