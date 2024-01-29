import React from 'react';
import { useSession, signIn, signOut, getCsrfToken } from 'next-auth/react';
import { stat } from 'fs';
import HostRoom from './HostRoom';

function UserProfile() {
  const { data: session } = useSession();

  //   if (status === 'loading') return <p>Loading...</p>;
  //   console.log('inside user profile', session);

  return session ? (
    <div>
      <p>Signed in as {session.user?.name}</p>
      <p>
        <button
          className="px-10 py-5  bg-black text-blue-400"
          onClick={() => signOut()}
        >
          Click here to sign out
        </button>
      </p>
    </div>
  ) : (
    <>
      <p>No session found</p>
    </>
  );
}

export default UserProfile;
