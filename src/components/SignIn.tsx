import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSession, signIn, getCsrfToken } from 'next-auth/react';
import { SignInButton, StatusAPIResponse } from '@farcaster/auth-kit';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import styles from "../../styles/Common.module.css"

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
    <div className="flex flex-col w-full min-h-screen bg-white lg:m-0 lg:p-0">
      <div className="Nav mx-2 mt-4 mb-2 flex flex-row justify-between items-center bg-hero-bg py-2 rounded-2xl">
        <Image
          src="/logo.svg"
          alt="showcast logo"
          width={202}
          height={41}
          className="lg:ml-10 mx-auto"
        />

        <div className="Button px-5 py-2 bg-white bg-opacity-10 rounded-xl justify-center items-center gap-1 lg:flex hidden mr-20">
          <SignInButton
            nonce={getNonce}
            onSuccess={handleSuccess}
            onError={() => setError(true)}
          />
        </div>
      </div>
      <div className="ImageAndContent flex flex-col lg:flex-row lg:w-full mt-2 mx-3 mb-4">
        <div className="w-full lg:w-1/2 lg:bg-slate-500 mr-2 mt-2 mb-4 rounded-3xl">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="lg:w-full lg:h-full rounded-3xl"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col lg:ml-2 lg:mr-4 mt-2 mb-4 justify-center items-center bg-signin-content-bg h-full rounded-xl">
          <div className="lg:m-16 lg:p-8 relative">
            <div className={`font-mona lg:text-3xl text-xl font-black uppercase text-black lg:mb-4 ${styles.signInSubTitle}`}>
              Welcome to Showcast
            </div>
            <div className={`font-mona lg:pt-4 lg:pb-6 pt-5 pb-6 font-black uppercase text-hero-bg lg:text-6xl text-4xl ${styles.signInSubTitle}`}>
              Ready to Meet
              <br />
              Farcaster Frens?
            </div>
            <hr className="opacity-30" />
            <div>
              <p className="font-manrope font-thin"><span className="font-medium">1. Age Limit:</span> Must be 18+ or 13+ with parental consent</p>
              <p className="font-manrope font-thin"><span className="font-medium">2. Content Alert:</span> May encounter adult or offensive content</p>
              <p className="font-manrope font-thin">
                <span className="font-medium">3. Respect Others:</span> No harassment or discrimination tolerated
              </p>
              <p className="font-manrope font-thin"><span className="font-medium">4. Protect Privacy:</span> Avoid sharing personal info</p>
              <p className="font-manrope font-thin"><span className="font-medium">5. Use at Own Risk:</span> Not liable for user interactions</p>
            </div>
            <hr className="opacity-30" />
            <div className="font-manrope font-light text-gray-500">
              Signing up for a Showcast account means you agree to the <Link className="no-underline outline-none text-black font-medium" href="#">Privacy
              Policy</Link> and <Link className="no-underline outline-none text-black font-medium" href="#">Terms of Service</Link>.
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
