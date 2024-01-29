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
import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { signOut } from 'next-auth/react';
import { set } from '@project-serum/anchor/dist/cjs/utils/features';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { useGlobalContext } from '@/src/context/GlobalContext';
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
      // isLoading.current = false;
      setJoinedAsHost(true);
    },
    onPeerJoin: (peer) => {
      console.log('onPeerJoin', peer);
      // Update database to reflect peer joining
      setPeerJoined(true);
    },
    onLeave: async () => {
      console.log('Successfully left the room');
    },
  });

  async function updateRoomStatus(isJoin: boolean) {
    const roomId = session.data?.user?.roomId;
    console.log('RoomId from updateRoomStatus', roomId);

    const response = await fetch('/api/room/update', {
      method: 'POST',
      body: JSON.stringify({ roomId, isJoin }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('Data from updateRoomStatus', data);
  }

  async function fetchUsers() {
    const response = await fetch('/api/users/list');
    const data = await response.json();
    // setUserRoomPool(data);
    updateRooms(data);
    console.log('Users from Supabase:', data);
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
      await updateRoomStatus(true);
      await fetchUsers();
    };
    join();
    // if (!isLoading.current) {
    //   join();
    // }
  }, [roomId]);

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

  // Update Current room status to connectd & fetch userPool

  const handlePeerSelect = async (peerRoomId: string) => {
    console.log('Peer selected');
    // setPeerIsSelected(true);
    // setSelectedPeerRoomId(peerRoomId);

    // Leave this room
    await leaveRoom();
    // Update database to reflect peer joining
    await updateRoomStatus(false);
    await router.push(`/room/host/${peerRoomId}`);
    // Join peer room using peerRoomId
    // host_is_connecting + host_is_joined = false + peer_is_joined = false
    // set state - host&peerjoined room => use this to reset userList
  };

  const handleLeaveRoom = async () => {
    await leaveRoom();
    await updateRoomStatus(false);
    const roomId = session.data?.user?.roomId;

    await router.push(`/room/host/${roomId}`);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-4 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold text-red-500">{state}</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {state === 'connected' && (
            <>
              <button
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={async () => {
                  isVideoOn ? await disableVideo() : await enableVideo();
                }}
              >
                {isVideoOn ? 'Disable Video' : 'Enable Video'}
              </button>
              <button
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={async () => {
                  isAudioOn ? await disableAudio() : await enableAudio();
                }}
              >
                {isAudioOn ? 'Disable Audio' : 'Enable Audio'}
              </button>

              <button
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={handleLeaveRoom}
              >
                Leave Room
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-full mt-8 flex gap-4 justify-between items-stretch">
        <div className="flex-1 justify-between items-center flex flex-col">
          <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
            <div className="relative flex gap-2">
              {isVideoOn && (
                <div className="w-1/2 mx-auto border-2 rounded-xl border-blue-400">
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

          <div className="mt-8 mb-32 grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
            {peerIds.map((peerId) =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>
        </div>
        {/* {state === 'connected' && <ChatBox />} */}
      </div>
      {/* <UserProfile /> */}
      <div>List of Online Users</div>
      {!peerJoined &&
        rooms.map((user) => (
          <div className="m-5 flex flex-row font-urbanist" key={user.id}>
            <div className="bg-blue-500 px-10 py-10 text-white">
              {user.fc_username}
            </div>
            <img
              className="hover:pointer"
              src={user.fc_image_url ?? ''}
              width={100}
              height={100}
              alt="Profile Pic of FC"
              onClick={() => handlePeerSelect(user.huddle_room_id)}
            />
          </div>
        ))}

      {session && (
        <button
          className="px-10 py-5  bg-black text-blue-400"
          onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}
        >
          Click here to sign out
        </button>
      )}
    </main>
  );
}

// UseEffect runs twice - isLoading ensures it is called once
