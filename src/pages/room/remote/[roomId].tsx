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

const inter = Inter({ subsets: ['latin'] });

type Props = {
  token: string;
};

export default function HostRoom({ token }: Props) {
  const [displayName, setDisplayName] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const session = useSession();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hostJoined, setHostJoined] = useState<boolean>(false);
  const { rooms, updateRooms } = useGlobalContext();
  const isLoading = useRef(false);

  const { joinRoom, leaveRoom, state } = useRoom({
    onJoin: async (room) => {
      console.log('onJoin', room);
      updateMetadata({ displayName: 'User1' });
      isLoading.current = false;
      // setHostJoined(true);
      await updateRoomStatus();
    },
    onPeerJoin: (peer) => {
      console.log('onPeerJoin', peer);
    },
    onLeave: () => {
      console.log('Successfully left the room');
      console.log('Inside onLeave');
    },
  });

  async function updateRoomStatus() {
    const response = await fetch('/api/room/update/peer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId: router.query.roomId }),
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

  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('PeerIds:', peerIds);
  console.log('State:', state);
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  // Autmatically join room and remove the idle aspect of code

  useEffect(() => {
    const join = async () => {
      isLoading.current = true;
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log('Inside useEffect - joinRoom');
      console.log('RoomId:', router.query.roomId);
      console.log('State: ', state);
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      await joinRoom({
        roomId: router.query.roomId as string,
        token,
      });
    };
    if (!isLoading.current) {
      join();
    }
  }, []);

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

  const handleLeaveRoom = async () => {
    await leaveRoom();
    console.log('Session:');
    console.log(session);
    const user = session.data?.user as User & DefaultSession['user'] & { roomId: string };
    const roomId = user.roomId;
    console.log('RoomId:', roomId);
    router.push(`/room/host/${roomId}`);
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
                onClick={leaveRoom}
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
      {/* <div>List of Online Users</div>
      {rooms.map((user) => (
        <div className="m-5 flex flex-row font-urbanist" key={user.id}>
          <div className="bg-blue-500 px-10 py-10 text-white">
            {user.fc_username}
          </div>
          <Image
            className="hover:pointer"
            src={user.fc_image_url ?? ''}
            width={100}
            height={100}
            alt="Profile Pic of FC"
            onClick={() => handlePeerSelect(user.huddle_room_id)}
          />
        </div>
      ))} */}

      <button
        className="px-10 py-5  bg-black text-blue-400"
        onClick={() => signOut()}
      >
        Click here to sign out
      </button>
    </main>
  );
}

import { GetServerSidePropsContext } from 'next';
import { signOut } from 'next-auth/react';
// import { set } from '@project-serum/anchor/dist/cjs/utils/features';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { useGlobalContext } from '@/src/context/GlobalContext';
import { DefaultSession, User } from 'next-auth';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // session
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE_API_KEY || '',
    roomId: ctx.params?.roomId?.toString() || '',
    role: Role.HOST,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });
  const token = await accessToken.toJwt();
  // console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
  console.log('Inside room/host/${roomId}.tsx');
  // console.log('Token:', token);
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
  // console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');

  return {
    props: { token },
  };
};

// UseEffect runs twice - isLoading ensures it is called once
