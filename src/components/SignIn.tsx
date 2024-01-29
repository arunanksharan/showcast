import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSession, signIn, getCsrfToken } from 'next-auth/react';
import { SignInButton, StatusAPIResponse } from '@farcaster/auth-kit';
import { useRouter } from 'next/router';
import Image from 'next/image';

function SignIn() {
  const [error, setError] = useState(false);
  const [isSignInComplete, setIsSignInComplete] = useState(false); // New state to control the sign-in completion
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isSignInComplete) {
      stopVideoStream();
    }
  }, [isSignInComplete]);

  useEffect(() => {
    if (status === 'authenticated' && !isSignInComplete) {
      setIsSignInComplete(true); // Mark sign-in as complete
      router.replace('/room/host');
    }
  }, [status, isSignInComplete, router]);

  useEffect(() => {
    // Function to initialize the webcam
    const initializeWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing the webcam', err);
      }
    };

    initializeWebcam();

    // Setup event listener for route changes
    const handleRouteChange = () => {
      stopVideoStream();
    };
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      stopVideoStream();
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

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

          router.push(`/room/host`); // Use Next.js router for redirection
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
    <div className="flex flex-col w-full min-h-screen bg-white m-0 p-0">
      <div className="Nav ml-2 mr-2 mt-4 mb-2 flex flex-row  justify-between items-center bg-hero-bg py-8 rounded-2xl">
        <Image
          src="/logo.svg"
          alt="showcast logo"
          width={202}
          height={41}
          className="ml-10"
        />

        <div className="Button px-3 py-1 bg-white bg-opacity-10 rounded-xl justify-center items-center gap-1 flex mr-20">
          <SignInButton
            nonce={getNonce}
            onSuccess={handleSuccess}
            onError={() => setError(true)}
          />
        </div>
      </div>
      <div className="ImageAndContent flex flex-row w-full h-screen mt-2 ml-2 mr-2 mb-4">
        <div className="w-1/2 bg-slate-500  mr-2 mt-2 mb-4 rounded-xl">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full rounded-xl"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="w-1/2 flex flex-col ml-2 mr-4 mt-2 mb-4 justify-center items-center bg-signin-content-bg h-full rounded-xl">
          <div className="m-20 p-8">
            <div className="font-mona text-3xl font-black uppercase text-black mb-4">
              Welcome to Showcast
            </div>
            <div className="font-mona font-black uppercase text-hero-bg text-6xl">
              Ready to Meet
              <br />
              Farcaster Frens
            </div>
            <div>
              <p>1. Age Limit: Must be 18+ or 13+ with parental consent</p>
              <p>2. Content Alert: May encounter adult or offensive content</p>
              <p>
                3. Respect Others: No harassment or discrimination tolerated
              </p>
              <p>4. Protect Privacy: Avoid sharing personal info</p>
              <p>5. Use at Own Risk: Not liable for user interactions</p>
            </div>
            <div>
              Signing up for a Showcast account means you agree to the Privacy
              Policy and Terms of Service.
            </div>
            <div className="mt-4 px-10 py-4 bg-hero-bg flex flex-row justify-center text-white font-manrope rounded-xl">
              <SignInButton
                nonce={getNonce}
                onSuccess={handleSuccess}
                onError={() => setError(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
