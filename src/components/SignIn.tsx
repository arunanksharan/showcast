import React, { useEffect, useCallback, useState } from 'react';
import { useSession, signIn, getCsrfToken } from 'next-auth/react';
import { SignInButton, StatusAPIResponse } from '@farcaster/auth-kit';
import { useRouter } from 'next/router';

function SignIn() {
  const [error, setError] = useState(false);
  const [isSignInComplete, setIsSignInComplete] = useState(false); // New state to control the sign-in completion

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && !isSignInComplete) {
      setIsSignInComplete(true); // Mark sign-in as complete
      router.replace('/room/host');
    }
  }, [status, isSignInComplete, router]);

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error('Unable to generate nonce');
    console.log('Nonce: ', nonce);
    return nonce;
  }, []);

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      console.log('Inside signin', res);
      if (status !== 'authenticated') {
        // Only call signIn if not already authenticated
        const result = await signIn('credentials', {
          message: res.message,
          signature: res.signature,
          name: res.username,
          pfp: res.pfpUrl,
          redirect: false,
        });
        if (result?.ok) {
          console.log('Sign in successful');
          console.log(JSON.stringify(result));
          setIsSignInComplete(true); // Mark sign-in as complete

          router.replace(`/room/host`); // Use Next.js router for redirection
        }
      }
    },
    [status, router]
  );

  if (status === 'authenticated' && isSignInComplete) {
    // User is authenticated and sign-in is complete, no need to render SignInButton
    return null;
  }

  return (
    <div className="signIn min-w-full min-h-screen p-4 md:p-8 flex flex-col justify-center items-center bg-back-brown">
      {!isSignInComplete && (
        <SignInButton
          nonce={getNonce}
          onSuccess={handleSuccess}
          onError={() => setError(true)}
        />
      )}
      {error && <div>Unable to sign in at this time.</div>}
      <div className="m-10 font-urbanist text-white text-xl">
        <p>
          1. Click the Sign in with Farcaster button above
          <br></br>2. Scan the QR code to sign in
        </p>
      </div>
    </div>
  );
}

export default SignIn;
