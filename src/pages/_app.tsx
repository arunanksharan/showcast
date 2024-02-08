import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SessionProvider } from 'next-auth/react';
import { useState, createContext } from 'react';
import { GlobalContextProvider } from '../context/GlobalContext';
import { signOut } from 'next-auth/react';

const config = {
  // For a production app, replace this with an Optimism Mainnet
  // RPC URL from a provider like Alchemy or Infura.
  relay: 'https://relay.farcaster.xyz',
  // rpcUrl: 'https://mainnet.optimism.io',
  rpcUrl:
    'https://opt-mainnet.g.alchemy.com/v2/TcSIWI9vCZw_u6ztvDp0DC2UFl5pgxap',
  domain: `${process.env['HOST']}`,
  // siweUri: 'https://example.com/login',
  // domain: 'http://localhost:3000',
  siweUri: `${process.env['HOST']}/login`,
};

console.log('config', config);

import { HuddleClient, HuddleProvider } from '@huddle01/react';
import { Room } from '@/types/room';

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
          <AuthKitProvider config={config}>
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
