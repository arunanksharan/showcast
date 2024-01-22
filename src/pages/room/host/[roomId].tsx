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

const inter = Inter({ subsets: ['latin'] });

type Props = {
  token: string;
};

export default function HostRoom({ token }: Props) {
  const [displayName, setDisplayName] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hostJoined, setHostJoined] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);

  const { joinRoom, state } = useRoom({
    onJoin: (room) => {
      console.log('onJoin', room);
      updateMetadata({ displayName });
      setHostJoined(true);
    },
    onPeerJoin: (peer) => {
      console.log('onPeerJoin', peer);
    },
  });
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();
  const { updateMetadata } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();

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

  useEffect(() => {
    // Update status of room to hostIsJoined = true & hostIsConnecting = false
    // UpdateRoomStatus called, then if success - fetchUsers called
    // async function updateRoomStatus() {
    //   const { data, error } = await supabase
    //     .from('rooms')
    //     .update({ hostIsJoined: true, hostIsConnecting: false })
    //     .match({ huddle_roomid: router.query.roomId });

    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(data);
    //     fetchUsers();
    //   }
    // }

    // List of users where isJoined=true and everything else is false isConnecting | peerIsJoined
    async function fetchUsers() {
      const response = await fetch('/api/getUsers');
      const data = await response.json();
      setUsers(data);
    }

    if (hostJoined) {
      // updateRoomStatus();
      fetchUsers();
    }
  }, [hostJoined]);

  console.log('Users from Supabase:', users);

  const handlePeerSelect = () => {
    console.log('Peer selected');

    // Get roomId of peer alongside user details - fetch from supabase
    router.push('/room/remote/[roomId]');
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-4 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold">{state}</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {state === 'idle' && (
            <>
              <input
                disabled={state !== 'idle'}
                placeholder="Display Name"
                type="text"
                className="border-2 border-blue-400 rounded-lg p-2 mx-2 bg-black text-white"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />

              <button
                disabled={!displayName}
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={async () => {
                  await joinRoom({
                    roomId: router.query.roomId as string,
                    token,
                  });
                }}
              >
                Join Room
              </button>
            </>
          )}

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
                onClick={async () => {
                  shareStream
                    ? await stopScreenShare()
                    : await startScreenShare();
                }}
              >
                {shareStream ? 'Disable Screen' : 'Enable Screen'}
              </button>
              <button
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={async () => {
                  const status = isRecording
                    ? await fetch(
                        `/api/stopRecording?roomId=${router.query.roomId}`
                      )
                    : await fetch(
                        `/api/startRecording?roomId=${router.query.roomId}`
                      );

                  const data = await status.json();
                  console.log({ data });
                  setIsRecording(!isRecording);
                }}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
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
              {shareStream && (
                <div className="w-1/2 mx-auto border-2 rounded-xl border-blue-400">
                  <video
                    ref={screenRef}
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
        {state === 'connected' && <ChatBox />}
      </div>
      {/* <UserProfile /> */}
      <div>List of Online Users</div>

      {users.map((user) => (
        <div className="m-5 flex flex-row font-urbanist">
          <div
            key={user.id}
            className="bg-blue-500 px-10 py-10 text-white hover:pointer"
          >
            {user.fc_username}
          </div>
          <Image
            src={user.fc_image_url}
            width={100}
            height={100}
            alt="Profile Pic of FC"
            onClick={handlePeerSelect}
          />
        </div>
      ))}
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
import UserProfile from '../../../components/UserProfile';
import { signOut } from 'next-auth/react';
import { set } from '@project-serum/anchor/dist/cjs/utils/features';
import Image from 'next/image';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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

  // Save this token to localstorage | cookie for persistence

  return {
    props: { token },
  };
};
