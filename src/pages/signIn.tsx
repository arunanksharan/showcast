import '@farcaster/auth-kit/styles.css';
import React from 'react';

import Head from 'next/head';
import SignIn from '../components/SignIn';

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Showcast</title>
      </Head>
      <main>
        <SignIn />
      </main>
    </>
  );
}
