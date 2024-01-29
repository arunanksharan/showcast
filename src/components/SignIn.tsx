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
    // <div className="signIn min-w-full min-h-screen p-4 md:p-8 flex flex-col justify-center items-center bg-back-brown">
    <div>
      {/* {!isSignInComplete && (
        <SignInButton
          nonce={getNonce}
          onSuccess={handleSuccess}
          onError={() => setError(true)}
        />
      )}
      {error && <div>Unable to sign in at this time.</div>} */}
      {/* <div className="m-10 font-urbanist text-white text-xl">
        <p>
          1. Click the Sign in with Farcaster button above
          <br></br>2. Scan the QR code to sign in
        </p>
      </div> */}
      <div className="MacbookPro14 w-[1440px] h-[900px] bg-white justify-center items-center inline-flex">
        <div className="Frame94 grow shrink basis-0 self-stretch p-4 flex-col justify-start items-start gap-4 inline-flex">
          <div className="Nav self-stretch p-4 bg-violet-500 rounded-xl justify-between items-center inline-flex">
            <div className="Logo w-[159.04px] h-8 relative">
              <div className="Group2 w-[34.89px] h-8 left-0 top-0 absolute">
                <div className="Rectangle12 w-[16.53px] h-[18.06px] left-[9.09px] top-[9.82px] absolute bg-violet-500 rounded-sm" />
                <div className="Ellipse3 w-[7.15px] h-[7.15px] left-[13.61px] top-[14.31px] absolute bg-white rounded-full" />
              </div>
            </div>
            <div className="Button px-3 py-2 bg-white bg-opacity-10 rounded-xl justify-center items-center gap-1 flex">
              {/* <div className="LeftIcon w-6 h-6 relative">
                <div className="Rectangle11 w-[225px] h-[225px] left-0 top-0 absolute" />
              </div> */}
              <div className="Wrap px-1 justify-start items-start flex">
                <div
                  className="SignInWithFarcaster text-white text-sm font-medium font-['Inter'] leading-normal"
                  // onClick={() => {
                  //   console.log('signin requested');
                  // }}
                >
                  {/* Sign in With Farcaster */}

                  <SignInButton
                    nonce={getNonce}
                    onSuccess={handleSuccess}
                    onError={() => setError(true)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="Frame95 self-stretch grow shrink basis-0 justify-start items-start gap-4 inline-flex">
            <img
              className="Image1 grow shrink basis-0 self-stretch rounded-3xl"
              src="https://via.placeholder.com/696x780"
            />
            <div className="Frame91 grow shrink basis-0 self-stretch bg-zinc-100 rounded-3xl justify-center items-center gap-4 flex">
              <div className="Frame2 h-[585px] p-8 rounded-3xl justify-center items-center gap-2.5 flex">
                <div className="Frame5 w-[400px] flex-col justify-start items-start gap-4 inline-flex">
                  <div className="Frame2 self-stretch h-[34px] flex-col justify-center items-start gap-3 flex">
                    <div className="Frame7 self-stretch h-[34px] flex-col justify-center items-start gap-1 flex">
                      <div className="WelcomeToShowcast text-black text-[40px] font-black font-['Mona Sans Condensed'] uppercase leading-[34px]">
                        Welcome to Showcast
                      </div>
                    </div>
                  </div>
                  <div className="ReadyToMeetFarcasterFrens self-stretch text-violet-500 text-7xl font-black font-['Mona Sans Condensed'] uppercase leading-[61.20px]">
                    Ready to meet farcaster frens?
                  </div>
                  <div className="Frame6 self-stretch h-32 flex-col justify-start items-start gap-3 flex">
                    <div className="AgeLimitMustBe18Or13WithParentalConsent self-stretch">
                      <span className="text-zinc-800 text-xs font-bold font-['Manrope'] leading-none">
                        Age Limit:
                      </span>
                      <span className="text-neutral-600 text-xs font-medium font-['Manrope'] leading-none">
                        {' '}
                        Must be 18+ or 13+ with parental consent
                      </span>
                    </div>
                    <div className="ContentAlertMayEncounterAdultOrOffensiveContent self-stretch">
                      <span className="text-zinc-800 text-xs font-bold font-['Manrope'] leading-none">
                        Content Alert
                      </span>
                      <span className="text-neutral-600 text-xs font-bold font-['Manrope'] leading-none">
                        :
                      </span>
                      <span className="text-neutral-600 text-xs font-medium font-['Manrope'] leading-none">
                        {' '}
                        May encounter adult or offensive content
                      </span>
                    </div>
                    <div className="RespectOthersNoHarassmentOrDiscriminationTolerated self-stretch">
                      <span className="text-zinc-800 text-xs font-bold font-['Manrope'] leading-none">
                        Respect Others:
                      </span>
                      <span className="text-neutral-600 text-xs font-bold font-['Manrope'] leading-none">
                        {' '}
                      </span>
                      <span className="text-neutral-600 text-xs font-medium font-['Manrope'] leading-none">
                        No harassment or discrimination tolerated
                      </span>
                    </div>
                    <div className="ProtectPrivacyAvoidSharingPersonalInfo self-stretch">
                      <span className="text-zinc-800 text-xs font-bold font-['Manrope'] leading-none">
                        Protect Privacy:
                      </span>
                      <span className="text-neutral-600 text-xs font-medium font-['Manrope'] leading-none">
                        {' '}
                        Avoid sharing personal info
                      </span>
                    </div>
                    <div className="UseAtOwnRiskNotLiableForUserInteractions self-stretch">
                      <span className="text-zinc-800 text-xs font-bold font-['Manrope'] leading-none">
                        Use at Own Risk:
                      </span>
                      <span className="text-neutral-600 text-xs font-bold font-['Manrope'] leading-none">
                        {' '}
                      </span>
                      <span className="text-neutral-600 text-xs font-medium font-['Manrope'] leading-none">
                        Not liable for user interactions
                      </span>
                    </div>
                  </div>
                  <div className="SigningUpForAShowcastAccountMeansYouAgreeToThePrivacyPolicyAndTermsOfService self-stretch">
                    <span className="text-neutral-400 text-xs font-medium font-['Manrope'] leading-none">
                      Signing up for a Showcast account means you agree to the{' '}
                    </span>
                    <span className="text-zinc-800 text-xs font-medium font-['Manrope'] leading-none">
                      Privacy Policy
                    </span>
                    <span className="text-neutral-400 text-xs font-medium font-['Manrope'] leading-none">
                      {' '}
                      and{' '}
                    </span>
                    <span className="text-zinc-800 text-xs font-medium font-['Manrope'] leading-none">
                      Terms of Service
                    </span>
                    <span className="text-neutral-400 text-xs font-medium font-['Manrope'] leading-none">
                      .
                    </span>
                  </div>
                  <div className="Button w-[400px] h-12 px-4 py-3 bg-violet-500 rounded-xl border-b border-black border-opacity-10 justify-center items-center gap-2.5 inline-flex">
                    <div className="LeftIcon w-5 h-5 relative">
                      <div className="Rectangle11 w-[225px] h-[225px] left-0 top-0 absolute" />
                    </div>
                    <div className="Text text-white text-base font-medium font-['Manrope']">
                      Sign in with Farcaster
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
