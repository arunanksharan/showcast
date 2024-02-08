import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SessionProvider } from 'next-auth/react';
import { useState, createContext } from 'react';
import { GlobalContextProvider } from '../context/GlobalContext';
import { signOut } from 'next-auth/react';
import { farcasterConfig } from '../services/config';
import React from 'react';

import { HuddleClient, HuddleProvider } from '@huddle01/react';
// import { Room } from '@/types/room';

const huddleClient = new HuddleClient({
  projectId: 'M1Q01XrKT3ouASzfleYo-HuutwpY3o56',
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // console.log('AuthKitProvider config', config);
  return (
    <GlobalContextProvider>
      <SessionProvider session={session}>
        <HuddleProvider client={huddleClient}>
          <AuthKitProvider config={farcasterConfig}>
            {session && (
              <button
                onClick={() =>
                  signOut({ callbackUrl: 'http://localhost:3000/' })
                }
              >
                Sign Out
              </button>
            )}
            <Component {...pageProps} />
          </AuthKitProvider>
        </HuddleProvider>
      </SessionProvider>
    </GlobalContextProvider>
  );
}
