import ChatBox from '../../../components/ChatBox/ChatBox';
import RemotePeer from '../../../components/RemotePeer/RemotePeer';
import { TPeerMetadata } from '../../../utils/types';
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from '@huddle01/react/hooks';
import React from 'react';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { signOut } from 'next-auth/react';
// import { set } from '@project-serum/anchor/dist/cjs/utils/features';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { useGlobalContext } from '../../../context/GlobalContext';
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
    const join = async () => {
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

  const handleLeaveRoom = async () => {
    await updateRoomStatusOnLeave();
    // const roomId = session.data?.user?.roomId;
    console.log('Inside Leave Room');
    console.log('RoomId from handleLeaveRoom', router.query.roomId);
    await leaveRoom();
    await router.push(`/room/host/`);
  };

  const handleSignOut = async () => {
    await disableVideo();
    await disableAudio();
    // Update users and rooms table
    const response = await fetch('/api/room/update/signOut', {
      method: 'POST',
      body: JSON.stringify({
        userId: session.data?.user?.id,
        roomId: router.query.roomId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Now sign out
      console.log('Response from signOut', response);
      signOut({ callbackUrl: 'http://localhost:3000/' });
    } else {
      // Handle any errors
      console.error('Failed to update before signing out.');
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-4 ${inter.className}`}
    >
      <div className="w-full flex gap-4 justify-between items-stretch">
        <div className="flex-1 justify-between items-center flex flex-row">
          <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
            <div className="relative flex gap-2">
              {isVideoOn && (
                <div className="rounded-xl">
                  <video
                    ref={videoRef}
                    className="aspect-video rounded-xl"
                    autoPlay
                    muted
                  />
                </div>
              )}
            </div>
          </div>

          <div className=" grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
            {peerIds.map((peerId) =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>
        </div>
        {/* {state === 'connected' && <ChatBox />} */}
      </div>
      <div className="flex flex-row m-4">
        {session && (
          <button
            className="bg-transparent border-1 border-solid border-white text-white font-manrope py-2 px-8 rounded-full flex items-center justify-center hover:bg-white hover:text-purple-700 transition-all mx-4"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        )}
        {state === 'connected' && (
          <>
            <button
              type="button"
              className="bg-transparent border-1 border-solid border-white text-white font-manrope py-2 px-8 rounded-full flex items-center justify-center hover:bg-white hover:text-purple-700 transition-all mx-4"
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

// UseEffect runs twice - isLoading ensures it is called once
